using ResuMeta.Models;
using System.Text.Json;
using ResuMeta.DAL.Abstract;
using ResuMeta.Services.Abstract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ResuMeta.Models.DTO;
using ResuMeta.ViewModels;
using ResuMeta.Data;


namespace ResuMeta.Services.Concrete
{
    class JsonApplicationTracker
    {
        public int? userInfoId { get; set; }
        public string? jobTitle { get; set; }
        public string? companyName { get; set; }
        public string? jobListingUrl { get; set; }
        public string? appliedDate { get; set; }
        public string? applicationDeadline { get; set; }
        public string? status { get; set; }
        public string? notes { get; set; }
    }

    public class ApplicationTrackerService : IApplicationTrackerService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ApplicationTrackerService> _logger;
        private readonly IRepository<UserInfo> _userInfo;
        private readonly IRepository<ApplicationTracker> _applicationTracker;
        private readonly IApplicationTrackerRepository _appTrackerRepo;


        public ApplicationTrackerService(
        ILogger<ApplicationTrackerService> logger,
        UserManager<ApplicationUser> userManager,
        IRepository<UserInfo> userInfo,
        IRepository<ApplicationTracker> applicationTracker,
        IApplicationTrackerRepository appTrackerRepo
        )
        {
            _logger = logger;
            _userManager = userManager;
            _userInfo = userInfo;
            _applicationTracker = applicationTracker;
            _appTrackerRepo = appTrackerRepo;
        }

        public List<ApplicationTrackerVM> GetApplicationsByUserId(int userId)
        {
            return _appTrackerRepo.GetApplicationsByUserId(userId);
        }

        public void AddApplication(JsonElement content)
        {
            //_logger.LogInformation($"Incoming JSON: {content}");
            try
            {
                JsonSerializerOptions options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                try
                {
                    JsonApplicationTracker applicationInfo = JsonSerializer.Deserialize<JsonApplicationTracker>(content, options)!;
                    if (applicationInfo.jobTitle == null)
                    {
                        throw new Exception("Invalid input");
                    }
                    ApplicationTracker applicationTracker = new ApplicationTracker
                    {
                        JobTitle = applicationInfo.jobTitle,
                        CompanyName = applicationInfo.companyName,
                        JobListingUrl = applicationInfo.jobListingUrl,
                        AppliedDate = DateOnly.Parse(applicationInfo.appliedDate!),
                        ApplicationDeadline = DateOnly.Parse(applicationInfo.applicationDeadline!),
                        Status = applicationInfo.status,
                        Notes = applicationInfo.notes,
                        UserInfoId = applicationInfo.userInfoId
                    };

                    _appTrackerRepo.AddOrUpdate(applicationTracker);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Error deserializing json");
                    throw new Exception("Error deserializing json");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in AddApplication method");
                throw;
            }
        }

        public void DeleteApplication(int applicationId)
        {
            var application = _appTrackerRepo.FindById(applicationId);
            if (application == null)
            {
                _logger.LogError($"Application with id {applicationId} does not exist");
                throw new Exception($"Application with id {applicationId} does not exist");
            }
            _appTrackerRepo.DeleteById(applicationId);
        }
    }
}