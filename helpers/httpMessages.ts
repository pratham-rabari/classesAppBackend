export default {
  LOGIN: {
    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    INVALID_EMAIL: "Kindly enter valid email",
    SUCCESS: "Login successfully.",
    INCORRECT_EMAIL_OR_PASS: "Incorrect email or password!",
    EMAIL_NOT_REGISTERED: "This Email is not registered with us",
    PASSWORD_CHANGED: "A new temporary password has been sent to your email. Please check your inbox."
  },
  RESETPASSWORD: {
    PASSWORD_REQUIRED: "Old Password is required",
    NEW_PASSWORD_REQUIRED: "New Password is required",
    PASSWORD_MIN_LENGTH: "New password is at least 8 characters long",
    PASSWORD_LENGTH: "New password ahould not more than 15 characters long",
    CONFIRM_PASSWORD_REQUIRED: "Confirm Password is required",
    PASSWORD_NOT_MATCHED: "New and confirm password not matched",
    OLD_PASSWORD_INCORRECT: "Incorrect old password",
    PASSWORD_RESET: "Password reset successfully"
  },
  STANDARD: {
    NAME_REQUIRED: "Standard name is required",
    NAME_LENGTH: "Standard name should be upto 30 character long",
    STANDARDS_FETCHED: "Standards fetched successfully",
    STANDARD_EXIST: "Standard already exist",
    STANDARD_ADDED: "Standard created successfully",
    STANDARD_UPDATED: "Standard updated successfully",
    STANDARD_DATA_FETCHED: "Standard data fetched successfully",
    STANDARD_DATA_NOT_FETCHED: "Standard data not found",
    STANDARD_DELETED: "Standard deactivated successfully"
  },
  STUDENT: {
    NAME_REQUIRED: "Student first name is required",
    LAST_NAME_REQUIRED: "Student last name is required",
    FIRST_NAME_REQUIRED: "Student first name is required",
    NAME_LENGTH: "Student first name should be upto 30 character long",
    LAST_NAME_LENGTH: "Student last name should be upto 30 character long",
    FIRST_NAME_LENGTH: "Student first name should be upto 30 character long",
    FATHER_NAME_LENGTH: "Student father name should be upto 30 character long",
    MOTHER_NAME_LENGTH: "Student mother name should be upto 30 character long",
    ADDRESS_NAME_LENGTH: "Student address name should be upto 30 character long",
    STUDENT_CONTACT_NO_REQUIRED:"Student parent contact number is required",
    STUDENT_EMERGENCY_CONTACT_NO_REQUIRED:"Student emergency contact number is required",
    STUDENT_FETCHED: "Student fetched successfully",
    STUDENT_EXIST: "Student already exist",
    STUDENT_ADDED: "Student created successfully",
    STUDENT_UPDATED: "Student updated successfully",
    STUDENT_DELETED: "Student deativated successfully",
    STUDENT_REACTIVATE: "Student Reactivate successfully",
    STUDENT_DATA_FETCHED: "Student data fetched successfully",
    STUDENT_DATA_NOT_FETCHED: "Student data not found",
    STUDENT_EXIST_WITH_THISFIRSTNAME: "student exist with this name",
    VALIDATION_ERROR: "error during validation",
    VALID_PHONE_NUMBER: "please enter valid phone number",
    VALID_PARENT_CONTACT_NO: "please enter valid parent contact number",
    VALID_EMERGENCY_CONTACT_NO: "please enter valid emergency contact number",
    NO_ATTENDANCE_DATA_FOR_STANDARD:"No attendance data is found for related standard",
    ATTENDANCE_DATA_FETCHED_FOR_STUDENT:"Attendance data is fetched for student"
  },

  TEACHER: {
    NAME_REQUIRED: "Teacher user name is required",
    NAME_LENGTH: "Teacher user name should be upto 30 character long",
    LAST_NAME_LENGTH: "Teacher last name should be upto 30 character long",
    FIRST_NAME_LENGTH: "Teacher first name should be upto 30 character long",
    ADDRESS_NAME_LENGTH: "Teacher address name should be upto 30 character long",
    TEACHER_FETCHED: "Teacher fetched successfully",
    TEACHER_EXIST: "Teacher already exist with this userName",
    TEACHER_ADDED: "Teacher created successfully",
    TEACHER_UPDATED: "Teacher updated successfully",
    TEACHER_DELETED: "Teacher deativated successfully",
    TEACHER_REACTIVATE: "Teacher Reactivate successfully",
    TEACHER_DATA_FETCHED: "Teacher data fetched successfully",
    TEACHER_DATA_NOT_FETCHED: "Teacher data not found",
    TEACHER_EXIST_WITH_THISFIRSTNAME: "Teacher exist with this name",
    TAECHER_WITH_SAME_EMAIL:"Teacher with this email is exist",
    VALIDATION_ERROR: "error during validation",
    VALID_NUMBER: "please enter valid phone number"
  },

  SUBJECT: {
    NAME_REQUIRED: "Subject name is required",
    NAME_LENGTH: "Subject name should be upto 30 character long",
    SUBJECT_FETCHED: "Subject fetched successfully",
    SUBJECT_EXIST: "Subject already exist",
    SUBJECT_ADDED: "Subject created successfully",
    SUBJECT_UPDATED: "Subject updated successfully",
    SUBJECT_DELETED: "Subject deativated successfully",
    SUBJECT_REACTIVATE: "Subject Reactivate successfully",
    SUBJECT_DATA_FETCHED: "Subject data fetched successfully",
    SUBJECT_DATA_NOT_FETCHED: "Subject data not found",
    VALIDATION_ERROR: "error during validation",
  },

  CLASSSCHEDULE : {
    CLASS_CREATED:"Class scheduled successfully",
    CLASS_OVERLAP:"The teacher has alredy scheduled class at same time you select please recheck it",
    CLASS_OVERLAP_STANDARD:"Cannot schedule two classes at same time in one standard",
    CLASS_FETCHED:"Classes fetched succesfully",
    CLASS_DELETED:"Class deleted successfully",
    CLASS_UPDATED:'Class updated successfully',
    CLASS_STATUS_UPDATED:'Class status updated successfully',
    GET_CLASS:"Class by id fetched succesfully",
    CLASS_RULE_UPDATED:"ClassRule updated successfull"
  },

  ATTENDANCE : {
    ATTENDENCE_CREATED:"Attendance added successfully",
    ATTENDANCE_NOT_FOUND_FOR_CLASSID:"Attendance not found for classId",
    CLASS_OVERLAP_STANDARD:"Cannot schedule two classes at same time in one standard",
    ATTENDANCE_FETCHED:"Attendance fetched succesfully",
    CLASS_DELETED:"Class deleted successfully",
    ATTENDANCE_UPDATED:'Attendance updated successfully',
    GET_CLASS:"Class by id fetched succesfully",
    ATTENDANC_DATA_NOT_FOUND_FOR_TEACHER:"No attendance data fpund for given teacher"
  },

  FEES_DETAILS:{
    FEES_DETAILS_ADD:"Student Fee Detail Add SuccessFully",
    FEES_DETAILS_MODIFIED:"Student Fee Detail Modified SuccessFully"
  },

  EXPENSES:{
    ADD_EXPENSES:"Expense is added succesfully",
    EDIT_EXPENSE:"Expense is edited succesfully",
    GET_EXPENSES:"Expense is fetched succedfully"
  },

 EXAM:{
  ADD_EXAM:"Exam is created succesfully",
  UPDATE_EXAM:"Exam is updated succesfully",
  GET_EXAM:"Exam is fetched successfully",
  MARKS_ADDED:"Exam marks added succesfully",
  MARKS_UPDATED:"Exam marks updated succesfully",
  NO_DATA_FOUND:"No exam data found for student"
 },


  REFRESH_TOKEN_SUCCESS: "Refresh token fetch successfully.",
  REFRESH_TOKEN_ERROR: "Invalid refresh token",
  SOMETHING_WENT_WRONG: "Something Went Wrong!"

};
