# TalentLMS Additional JavaScript

Just decided to upload some custom JavaScript that may help or not some TalentLMS users. Nothing fancy but may make your life easier for 5 minutes :p

I can't guarantee that the scripts will work allways and everywhere but I would appreciate it if you notify me.
___
### Additional Mass Actions ![Mass Actions](icons/massaction.png)

Mass action scripts are adding a dropdown over the respective datatables where you can select the actions described bellow.
* coursestobranch.js: You can add all courses to a branch or remove all courses from a branch. 
* userstobranch.js: You can add all users to a branch or remove all users from a branch. 
* userstocourse.js: You can enroll all users in a course or unenroll all users from a course.
* coursestogroup.js: You can add all courses to a group or remove all courses from a group.
* usertobranches.js: You can add a user to all branches or remove a user from all branches.
* usertocourses.js: You can enroll a user in all courses (happy user) or unenroll a user from  all courses (sad user).
* usertogroups.js: You can add a user in all groups or remove a user from all groups.

**You can combine all of the above using massactionscombined.js instead of adding the scripts separately**
___
### Additional Filters ![Filters](icons/filter.png)

Adds some additional options in the filter dropdown under datatables. In essence when selecting one of the additional filters, the current datatable is being destroyed and a new client-side datatable is being created with the filtered data.
* usertypefilter.js: Filter users by User-Type in the main users list. This works only on the list-view. **Not** on the grid-view. 
* courseusersrolebasedfilter.js: Filter users based on their role in the course (learners, instructors, not enrolled) and also adds a filter for learners that has instructor privileges (learners with instructor privileges).

*Bug: Both of these have a problem on CSV export. Some dates are not formatted correctly.*

**You can combine all of the above using filterscombined.js instead of adding the scripts separately**

___
*Enjoy fellow admins!*