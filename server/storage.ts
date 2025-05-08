import { 
  User, InsertUser, 
  TimeRecord, InsertTimeRecord, 
  BreakRecord, InsertBreakRecord, 
  UserStatus, InsertUserStatus, 
  DailySummary, InsertDailySummary, 
  ActivityLog, InsertActivityLog,
  UserStatusType,
  TimeRecordType
} from "@shared/schema";
import { add, differenceInSeconds, format, parseISO, startOfDay } from "date-fns";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Time record operations
  createTimeRecord(record: InsertTimeRecord): Promise<TimeRecord>;
  getTimeRecordsForUser(userId: number, date?: Date): Promise<TimeRecord[]>;
  
  // Break record operations
  createBreakRecord(record: InsertBreakRecord): Promise<BreakRecord>;
  updateBreakRecord(id: number, updates: Partial<BreakRecord>): Promise<BreakRecord | undefined>;
  getBreakRecordsForUser(userId: number, date?: Date): Promise<BreakRecord[]>;
  getCurrentBreakForUser(userId: number): Promise<BreakRecord | undefined>;

  // User status operations
  getUserStatus(userId: number): Promise<UserStatus | undefined>;
  updateUserStatus(userId: number, updates: Partial<UserStatus>): Promise<UserStatus | undefined>;
  createUserStatus(status: InsertUserStatus): Promise<UserStatus>;
  getAllUserStatuses(): Promise<UserStatus[]>;
  
  // Daily summary operations
  createDailySummary(summary: InsertDailySummary): Promise<DailySummary>;
  getDailySummary(date: Date): Promise<DailySummary | undefined>;
  updateDailySummary(id: number, updates: Partial<DailySummary>): Promise<DailySummary | undefined>;
  
  // Activity log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getRecentActivityLogs(limit?: number): Promise<ActivityLog[]>;
  getActivityLogsForUser(userId: number, limit?: number): Promise<ActivityLog[]>;
  
  // Status summary
  getStatusSummary(): Promise<{ online: number, break: number, offline: number, late: number, total: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private timeRecords: Map<number, TimeRecord>;
  private breakRecords: Map<number, BreakRecord>;
  private userStatuses: Map<number, UserStatus>;
  private dailySummaries: Map<number, DailySummary>;
  private activityLogs: Map<number, ActivityLog>;
  
  private userId: number;
  private timeRecordId: number;
  private breakRecordId: number;
  private dailySummaryId: number;
  private activityLogId: number;

  constructor() {
    this.users = new Map();
    this.timeRecords = new Map();
    this.breakRecords = new Map();
    this.userStatuses = new Map();
    this.dailySummaries = new Map();
    this.activityLogs = new Map();
    
    this.userId = 1;
    this.timeRecordId = 1;
    this.breakRecordId = 1;
    this.dailySummaryId = 1;
    this.activityLogId = 1;
    
    // Initialize with dummy data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const avatarInitials = this.generateAvatarInitials(insertUser.name);
    const user: User = { ...insertUser, id, avatarInitials, active: true };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Time record operations
  async createTimeRecord(record: InsertTimeRecord): Promise<TimeRecord> {
    const id = this.timeRecordId++;
    const timeRecord: TimeRecord = { 
      ...record, 
      id, 
      timestamp: new Date()
    };
    this.timeRecords.set(id, timeRecord);
    return timeRecord;
  }

  async getTimeRecordsForUser(userId: number, date?: Date): Promise<TimeRecord[]> {
    const records = Array.from(this.timeRecords.values())
      .filter(record => record.userId === userId);
    
    if (date) {
      const startDate = startOfDay(date);
      const endDate = add(startDate, { days: 1 });
      return records.filter(record => {
        const recordDate = record.timestamp;
        return recordDate >= startDate && recordDate < endDate;
      });
    }
    
    return records;
  }

  // Break record operations
  async createBreakRecord(record: InsertBreakRecord): Promise<BreakRecord> {
    const id = this.breakRecordId++;
    const breakRecord: BreakRecord = { 
      ...record, 
      id, 
      startTime: new Date(),
      endTime: null
    };
    this.breakRecords.set(id, breakRecord);
    return breakRecord;
  }

  async updateBreakRecord(id: number, updates: Partial<BreakRecord>): Promise<BreakRecord | undefined> {
    const record = this.breakRecords.get(id);
    if (!record) return undefined;
    
    const updatedRecord = { ...record, ...updates };
    this.breakRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async getBreakRecordsForUser(userId: number, date?: Date): Promise<BreakRecord[]> {
    const records = Array.from(this.breakRecords.values())
      .filter(record => record.userId === userId);
    
    if (date) {
      const startDate = startOfDay(date);
      const endDate = add(startDate, { days: 1 });
      return records.filter(record => {
        const recordDate = record.startTime;
        return recordDate >= startDate && recordDate < endDate;
      });
    }
    
    return records;
  }

  async getCurrentBreakForUser(userId: number): Promise<BreakRecord | undefined> {
    return Array.from(this.breakRecords.values())
      .find(record => record.userId === userId && !record.endTime);
  }

  // User status operations
  async getUserStatus(userId: number): Promise<UserStatus | undefined> {
    return this.userStatuses.get(userId);
  }

  async updateUserStatus(userId: number, updates: Partial<UserStatus>): Promise<UserStatus | undefined> {
    const status = this.userStatuses.get(userId);
    if (!status) return undefined;
    
    const updatedStatus = { ...status, ...updates };
    this.userStatuses.set(userId, updatedStatus);
    return updatedStatus;
  }

  async createUserStatus(status: InsertUserStatus): Promise<UserStatus> {
    const userStatus: UserStatus = { 
      ...status,
      totalWorkTime: 0,
      totalBreakTime: 0,
      currentDate: new Date()
    };
    this.userStatuses.set(status.userId, userStatus);
    return userStatus;
  }

  async getAllUserStatuses(): Promise<UserStatus[]> {
    return Array.from(this.userStatuses.values());
  }

  // Daily summary operations
  async createDailySummary(summary: InsertDailySummary): Promise<DailySummary> {
    const id = this.dailySummaryId++;
    const dailySummary: DailySummary = { ...summary, id };
    this.dailySummaries.set(id, dailySummary);
    return dailySummary;
  }

  async getDailySummary(date: Date): Promise<DailySummary | undefined> {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    return Array.from(this.dailySummaries.values())
      .find(summary => format(summary.date, 'yyyy-MM-dd') === dateStr);
  }

  async updateDailySummary(id: number, updates: Partial<DailySummary>): Promise<DailySummary | undefined> {
    const summary = this.dailySummaries.get(id);
    if (!summary) return undefined;
    
    const updatedSummary = { ...summary, ...updates };
    this.dailySummaries.set(id, updatedSummary);
    return updatedSummary;
  }

  // Activity log operations
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogId++;
    const activityLog: ActivityLog = { 
      ...log, 
      id, 
      timestamp: new Date() 
    };
    this.activityLogs.set(id, activityLog);
    return activityLog;
  }

  async getRecentActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getActivityLogsForUser(userId: number, limit: number = 10): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Status summary
  async getStatusSummary(): Promise<{ online: number, break: number, offline: number, late: number, total: number }> {
    const statuses = Array.from(this.userStatuses.values());
    const total = this.users.size;
    
    const online = statuses.filter(s => s.status === UserStatusType.ONLINE).length;
    const onBreak = statuses.filter(s => s.status === UserStatusType.BREAK).length;
    const offline = statuses.filter(s => s.status === UserStatusType.OFFLINE).length;
    const late = statuses.filter(s => s.status === UserStatusType.LATE).length;
    
    return {
      online,
      break: onBreak,
      offline,
      late,
      total
    };
  }

  // Helper methods
  private generateAvatarInitials(name: string): string {
    if (!name) return '';
    
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    
    return nameParts[0].substring(0, 2).toUpperCase();
  }

  private initializeData() {
    // Create sample users
    const users = [
      { username: 'maria', password: 'password123', name: 'María Rodriguez', position: 'Agente Senior', role: 'employee' },
      { username: 'carlos', password: 'password123', name: 'Carlos Lopez', position: 'Agente', role: 'employee' },
      { username: 'ana', password: 'password123', name: 'Ana Torres', position: 'Agente', role: 'employee' },
      { username: 'javier', password: 'password123', name: 'Javier Garcia', position: 'Supervisor', role: 'supervisor' },
      { username: 'laura', password: 'password123', name: 'Laura Martinez', position: 'Agente Senior', role: 'employee' },
      { username: 'juan', password: 'password123', name: 'Juan Diaz', position: 'Supervisor', role: 'supervisor' },
    ];

    users.forEach(userData => this.createUser(userData as InsertUser));

    // Set up statuses
    const now = new Date();
    const eightAM = new Date(now);
    eightAM.setHours(8, 0, 0, 0);

    const eightThirtyAM = new Date(now);
    eightThirtyAM.setHours(8, 30, 0, 0);

    const nineAM = new Date(now);
    nineAM.setHours(9, 0, 0, 0);

    const nineFifteenAM = new Date(now);
    nineFifteenAM.setHours(9, 15, 0, 0);

    // Set up user statuses
    this.createUserStatus({ userId: 1, status: UserStatusType.ONLINE, lastClockIn: eightAM });
    this.createUserStatus({ userId: 2, status: UserStatusType.BREAK, lastClockIn: eightThirtyAM });
    this.createUserStatus({ userId: 3, status: UserStatusType.ONLINE, lastClockIn: nineAM });
    this.createUserStatus({ userId: 4, status: UserStatusType.OFFLINE });
    this.createUserStatus({ userId: 5, status: UserStatusType.LATE, lastClockIn: nineFifteenAM });
    this.createUserStatus({ userId: 6, status: UserStatusType.ONLINE, lastClockIn: eightAM });

    // Create time records
    this.createTimeRecord({ userId: 1, type: TimeRecordType.CLOCK_IN });
    this.createTimeRecord({ userId: 2, type: TimeRecordType.CLOCK_IN });
    this.createTimeRecord({ userId: 3, type: TimeRecordType.CLOCK_IN });
    this.createTimeRecord({ userId: 5, type: TimeRecordType.CLOCK_IN });
    this.createTimeRecord({ userId: 6, type: TimeRecordType.CLOCK_IN });

    // Create a break for user 2
    const breakRecord = this.createBreakRecord({ userId: 2, type: "coffee" });
    breakRecord.then(record => {
      this.updateUserStatus(2, { currentBreakId: record.id });
    });

    // Create activity logs
    const logs = [
      { userId: 2, action: "start-break", details: { type: "coffee" } },
      { userId: 3, action: "clock-in", details: null },
      { userId: 5, action: "clock-in-late", details: null },
      { userId: 4, action: "end-break", details: { type: "lunch" } },
    ];

    logs.forEach(log => this.createActivityLog(log as InsertActivityLog));

    // Create daily summary
    this.createDailySummary({
      date: now,
      totalUsers: 58,
      presentUsers: 42,
      onBreakUsers: 8,
      absentUsers: 8,
      lateUsers: 0,
      totalWorkHours: 287,
      totalBreakTime: 45,
      statsData: {
        attendance: 86,
        punctuality: 92,
        breakTimePercent: 12,
        overtimePercent: 3
      }
    });
  }
}

export const storage = new MemStorage();
