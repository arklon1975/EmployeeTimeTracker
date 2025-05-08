import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertTimeRecordSchema, 
  insertBreakRecordSchema, 
  TimeRecordType,
  UserStatusType
} from "@shared/schema";
import { format, parseISO, differenceInSeconds } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Time tracking routes
  app.post("/api/time-records", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTimeRecordSchema.parse(req.body);
      const timeRecord = await storage.createTimeRecord(validatedData);
      
      // Update user status based on time record type
      const userStatus = await storage.getUserStatus(validatedData.userId);
      
      if (validatedData.type === TimeRecordType.CLOCK_IN) {
        // If user is clocking in late (after 9 AM)
        const now = new Date();
        const nineAM = new Date(now);
        nineAM.setHours(9, 0, 0, 0);
        
        const status = now > nineAM ? UserStatusType.LATE : UserStatusType.ONLINE;
        
        if (userStatus) {
          await storage.updateUserStatus(validatedData.userId, {
            status,
            lastClockIn: new Date()
          });
        } else {
          await storage.createUserStatus({
            userId: validatedData.userId,
            status,
            lastClockIn: new Date()
          });
        }
        
        // Create activity log
        const action = status === UserStatusType.LATE ? "clock-in-late" : "clock-in";
        await storage.createActivityLog({
          userId: validatedData.userId,
          action,
          details: null
        });
      } else if (validatedData.type === TimeRecordType.CLOCK_OUT) {
        if (userStatus) {
          await storage.updateUserStatus(validatedData.userId, {
            status: UserStatusType.OFFLINE,
            lastClockOut: new Date()
          });
        }
        
        // Create activity log
        await storage.createActivityLog({
          userId: validatedData.userId,
          action: "clock-out",
          details: null
        });
      }
      
      res.status(201).json(timeRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid time record data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create time record" });
    }
  });

  // Break tracking routes
  app.post("/api/break-records", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBreakRecordSchema.parse(req.body);
      const breakRecord = await storage.createBreakRecord(validatedData);
      
      // Update user status
      await storage.updateUserStatus(validatedData.userId, {
        status: UserStatusType.BREAK,
        currentBreakId: breakRecord.id
      });
      
      // Create activity log
      await storage.createActivityLog({
        userId: validatedData.userId,
        action: "start-break",
        details: { type: validatedData.type }
      });
      
      res.status(201).json(breakRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid break record data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create break record" });
    }
  });

  app.put("/api/break-records/:id/end", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid break record ID" });
      }

      const breakRecord = await storage.updateBreakRecord(id, {
        endTime: new Date()
      });
      
      if (!breakRecord) {
        return res.status(404).json({ message: "Break record not found" });
      }
      
      // Update user status
      await storage.updateUserStatus(breakRecord.userId, {
        status: UserStatusType.ONLINE,
        currentBreakId: null
      });
      
      // Calculate and update break time
      const userStatus = await storage.getUserStatus(breakRecord.userId);
      if (userStatus && breakRecord.startTime && breakRecord.endTime) {
        const breakDuration = differenceInSeconds(breakRecord.endTime, breakRecord.startTime);
        const updatedBreakTime = (userStatus.totalBreakTime || 0) + breakDuration;
        
        await storage.updateUserStatus(breakRecord.userId, {
          totalBreakTime: updatedBreakTime
        });
      }
      
      // Create activity log
      await storage.createActivityLog({
        userId: breakRecord.userId,
        action: "end-break",
        details: { type: breakRecord.type }
      });
      
      res.json(breakRecord);
    } catch (error) {
      res.status(500).json({ message: "Failed to end break" });
    }
  });

  // User status routes
  app.get("/api/user-statuses", async (req: Request, res: Response) => {
    try {
      const statuses = await storage.getAllUserStatuses();
      
      // Enhance with user information
      const enhancedStatuses = await Promise.all(
        statuses.map(async (status) => {
          const user = await storage.getUser(status.userId);
          let currentBreak = null;
          
          if (status.currentBreakId) {
            currentBreak = await storage.getBreakRecords(status.currentBreakId);
          }
          
          return {
            ...status,
            user,
            currentBreak
          };
        })
      );
      
      res.json(enhancedStatuses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user statuses" });
    }
  });

  app.get("/api/user-statuses/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const status = await storage.getUserStatus(userId);
      if (!status) {
        return res.status(404).json({ message: "User status not found" });
      }

      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user status" });
    }
  });

  // Activity log routes
  app.get("/api/activity-logs", async (req: Request, res: Response) => {
    try {
      const limitParam = req.query.limit;
      const limit = limitParam ? parseInt(limitParam as string) : 10;
      
      const logs = await storage.getRecentActivityLogs(limit);
      
      // Enhance with user information
      const enhancedLogs = await Promise.all(
        logs.map(async (log) => {
          const user = await storage.getUser(log.userId);
          return {
            ...log,
            user
          };
        })
      );
      
      res.json(enhancedLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Status summary route
  app.get("/api/status-summary", async (req: Request, res: Response) => {
    try {
      const summary = await storage.getStatusSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch status summary" });
    }
  });

  // Daily summary route
  app.get("/api/daily-summary", async (req: Request, res: Response) => {
    try {
      const dateParam = req.query.date as string;
      const date = dateParam ? parseISO(dateParam) : new Date();
      
      const summary = await storage.getDailySummary(date);
      if (!summary) {
        return res.status(404).json({ message: "Daily summary not found" });
      }
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily summary" });
    }
  });

  // Route to calculate total work time for a user on the current day
  app.get("/api/users/:userId/work-time", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const today = new Date();
      const timeRecords = await storage.getTimeRecordsForUser(userId, today);
      const breakRecords = await storage.getBreakRecordsForUser(userId, today);
      
      // Calculate total time
      let totalWorkSeconds = 0;
      let totalBreakSeconds = 0;
      
      // Process clock-in/clock-out pairs
      let lastClockIn: Date | null = null;
      
      for (const record of timeRecords.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())) {
        if (record.type === TimeRecordType.CLOCK_IN) {
          lastClockIn = record.timestamp;
        } else if (record.type === TimeRecordType.CLOCK_OUT && lastClockIn) {
          totalWorkSeconds += differenceInSeconds(record.timestamp, lastClockIn);
          lastClockIn = null;
        }
      }
      
      // If still clocked in, count time until now
      if (lastClockIn) {
        totalWorkSeconds += differenceInSeconds(new Date(), lastClockIn);
      }
      
      // Process breaks
      for (const breakRecord of breakRecords) {
        if (breakRecord.startTime && breakRecord.endTime) {
          totalBreakSeconds += differenceInSeconds(breakRecord.endTime, breakRecord.startTime);
        } else if (breakRecord.startTime && !breakRecord.endTime) {
          // For ongoing breaks
          totalBreakSeconds += differenceInSeconds(new Date(), breakRecord.startTime);
        }
      }
      
      // Convert to hours and minutes for display
      const workHours = Math.floor(totalWorkSeconds / 3600);
      const workMinutes = Math.floor((totalWorkSeconds % 3600) / 60);
      
      const breakMinutes = Math.floor(totalBreakSeconds / 60);
      
      res.json({
        totalWorkSeconds,
        totalBreakSeconds,
        workTimeFormatted: `${workHours}h ${workMinutes}m`,
        breakTimeFormatted: `${breakMinutes}m`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate work time" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
