using ResuMeta.Data;
using ResuMeta.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResuMeta.Utilities
{
    public static class SeedUsers
    {
        
        public static async Task Initialize(IServiceProvider serviceProvider, SeedUserInfo[] seedData, string seedUserPw)
        {
            try
            {
                using (var context = new ResuMetaDbContext(serviceProvider.GetRequiredService<DbContextOptions<ResuMetaDbContext>>()))
                {
                    var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                    //var passwordHasher = serviceProvider.GetRequiredService<IPasswordHasher<ApplicationUser>>();


                    foreach(var u in seedData)
                    {
                        var identityID = await EnsureUser(userManager, seedUserPw, u.Email!, u.Email!, u.EmailConfirmed);
                        UserInfo appUser = new UserInfo { AspnetIdentityId = identityID, FirstName = u.FirstName, LastName = u.LastName, PhoneNumber = u.PhoneNumber, Email = u.Email};
                        if(!context.UserInfos.Any(x => x.AspnetIdentityId == appUser.AspnetIdentityId && x.FirstName == appUser.FirstName && x.LastName == appUser.LastName && x.PhoneNumber == appUser.PhoneNumber && x.Email == appUser.Email))
                        {
                            context.UserInfos.Add(appUser);
                            await context.SaveChangesAsync();
                        }
                    }
                }
            }
            catch(InvalidOperationException)
            {
                throw new InvalidOperationException("Failed to initialize user seed data, service provider did not have the correct service");
            }
        }

        private static async Task<string> EnsureUser(UserManager<ApplicationUser> userManager, string password, string username, string email, bool emailConfirmed)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user == null)
            {
                user = new ApplicationUser 
                { 
                    UserName = username, 
                    Email = email, 
                    EmailConfirmed = emailConfirmed
                    // SecurityQuestion1 = u.SecurityQuestion1,
                    // SecurityAnswer1 = passwordHasher.HashPassword(user, u.SecurityAnswer1),
                    // SecurityQuestion2 = u.SecurityQuestion2,
                    // SecurityAnswer2 = passwordHasher.HashPassword(user, u.SecurityAnswer2),
                    // SecurityQuestion3 = u.SecurityQuestion3,
                    // SecurityAnswer3 = passwordHasher.HashPassword(user, u.SecurityAnswer3)
                };
                await userManager.CreateAsync(user, password);
            }
            if (user == null)
            {
                throw new InvalidOperationException("The user was not created, password may not be strong enough or user may have an invalid email address");
            }
            
            return user.Id;
        }

    }
}