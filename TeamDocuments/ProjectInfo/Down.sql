ALTER TABLE [ApplicationTracker] DROP CONSTRAINT [Fk ApplicationTracker UserInfo Id];
ALTER TABLE [ReferenceContactInfo] DROP CONSTRAINT [Fk ReferenceContactInfo EmploymentHistory Id];
ALTER TABLE [Degree] DROP CONSTRAINT [Fk Degree Education Id];
ALTER TABLE [Achievements] DROP CONSTRAINT [Fk Achievements UserInfo Id];
ALTER TABLE [Projects] DROP CONSTRAINT [Fk Projects UserInfo Id];
ALTER TABLE [UserSkill] DROP CONSTRAINT [Fk UserSkill Skill Id];
ALTER TABLE [UserSkill] DROP CONSTRAINT [Fk UserSkill UserInfo Id];
ALTER TABLE [EmploymentHistory] DROP CONSTRAINT [Fk EmploymentHistory UserInfo Id];
ALTER TABLE [Education] DROP CONSTRAINT [Fk Education UserInfo Id];
ALTER TABLE [Achievements] DROP CONSTRAINT [Fk Achievements Resume Id];
ALTER TABLE [EmploymentHistory] DROP CONSTRAINT [Fk EmploymentHistory Resume Id];
ALTER TABLE [Projects] DROP CONSTRAINT [Fk Projects Resume Id];
ALTER TABLE [Education] DROP CONSTRAINT [Fk Education Resume Id];
ALTER TABLE [UserSkill] DROP CONSTRAINT [Fk UserSkill Resume Id];
ALTER TABLE [Resume] DROP CONSTRAINT [Fk Resume UserInfo Id];
ALTER TABLE [CoverLetter] DROP CONSTRAINT [Fk CoverLetter UserInfo Id];
ALTER TABLE [Profile] DROP CONSTRAINT [Fk Profile UserInfo Id];
ALTER TABLE [Profile] DROP CONSTRAINT [Fk Profile Resume Id];
ALTER TABLE [UserVote] DROP CONSTRAINT [Fk UserVote UserInfo Id];
ALTER TABLE [UserVote] DROP CONSTRAINT [Fk UserVote Resume Id];
ALTER TABLE [UserVote] DROP CONSTRAINT [Fk UserVote Vote Id];
ALTER TABLE [ProfileViews] DROP CONSTRAINT [Fk ProfileViews Profile Id]
ALTER TABLE [Follower] DROP CONSTRAINT [Fk Follower Profile Id]
ALTER TABLE [Follower] DROP CONSTRAINT [Fk Follower FollowerProfile Id]

DROP TABLE [ApplicationTracker];
DROP TABLE [ReferenceContactInfo];
DROP TABLE [Degree];
DROP TABLE [Achievements];
DROP TABLE [Projects];
DROP TABLE [UserSkill];
DROP TABLE [Skills];
DROP TABLE [EmploymentHistory];
DROP TABLE [Education];
DROP TABLE [Resume];
DROP TABLE [UserInfo];
DROP TABLE [CoverLetter];
DROP TABLE [ResumeTemplate];
DROP TABLE [Profile];
DROP TABLE [UserVote];
DROP TABLE [Vote];
DROP TABLE [ProfileViews];
DROP TABLE [Follower];