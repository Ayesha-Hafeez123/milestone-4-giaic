function generateEditableSection(title, content) {
    return "\n      <div class=\"editable-section\">\n        <h2>".concat(title, "</h2>\n        <p class=\"editable-content\" contenteditable=\"false\">").concat(content, "</p>\n        <div class=\"button-group\">\n          <button class=\"edit-button\">Edit</button>\n          <button class=\"save-button hidden\">Save</button>\n        </div>\n      </div>\n    ");
}
function generateEditableListSection(title, items) {
    var listItems = items.map(function (item) { return "<li>".concat(item.trim(), "</li>"); }).join('');
    return "\n      <div class=\"editable-section\">\n        <h2>".concat(title, "</h2>\n        <ul class=\"editable-content\" contenteditable=\"false\">\n          ").concat(listItems, "\n        </ul>\n        <div class=\"button-group\">\n          <button class=\"edit-button\">Edit</button>\n          <button class=\"save-button hidden\">Save</button>\n        </div>\n      </div>\n    ");
}
function generatePersonalInfoSectionWithEdit(name, email, phone, profilePicSrc) {
    var imgHtml = '';
    if (profilePicSrc) {
        imgHtml = "\n        <img src=\"".concat(profilePicSrc, "\" alt=\"Profile Picture\" id=\"profile-pic-output\" />\n        <div class=\"button-group\">\n          <button class=\"edit-profile-pic-button\">Edit Picture</button>\n        </div>\n      ");
    }
    return "\n      <div class=\"editable-section\" id=\"personal-info-section\">\n        <h2>Personal Information</h2>\n        ".concat(imgHtml, "\n        <p class=\"editable-content\" contenteditable=\"false\"><strong>Name:</strong> ").concat(name, "</p>\n        <p class=\"editable-content\" contenteditable=\"false\"><strong>Email:</strong> ").concat(email, "</p>\n        <p class=\"editable-content\" contenteditable=\"false\"><strong>Phone:</strong> ").concat(phone, "</p>\n        <div class=\"button-group\">\n          <button class=\"edit-button\">Edit</button>\n          <button class=\"save-button hidden\">Save</button>\n        </div>\n      </div>\n    ");
}
var form = document.getElementById('resume-form');
var resumeOutput = document.getElementById('resume-output');
var personalInfoOutput = document.getElementById('personal-info-output');
var educationOutput = document.getElementById('education-output');
var workExperienceOutput = document.getElementById('work-experience-output');
var skillsOutput = document.getElementById('skills-output');
form.addEventListener('submit', function (event) {
    var _a;
    event.preventDefault();
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var education = document.getElementById('education').value;
    var workExperience = document.getElementById('work-experience').value;
    var skills = document.getElementById('skills').value.split(',');
    var profilePicInput = document.getElementById('profile-pic');
    var profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
    var handleProfilePic = function (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject('Error reading profile picture.');
            };
            reader.readAsDataURL(file);
        });
    };
    var populateResume = function (profilePicSrc) {
        personalInfoOutput.innerHTML = generatePersonalInfoSectionWithEdit(name, email, phone, profilePicSrc);
        educationOutput.innerHTML = generateEditableSection('Education', education);
        workExperienceOutput.innerHTML = generateEditableSection('Work Experience', workExperience);
        skillsOutput.innerHTML = generateEditableListSection('Skills', skills);
        resumeOutput.classList.remove('hidden');
        form.reset();
    };
    if (profilePicFile) {
        handleProfilePic(profilePicFile).then(function (profilePicSrc) {
            populateResume(profilePicSrc);
        }).catch(function (error) {
            console.error(error);
            populateResume();
        });
    }
    else {
        populateResume();
    }
});
function toggleEditSave(button, saveButton, contentElement) {
    if (button.textContent === 'Edit') {
        contentElement.setAttribute('contenteditable', 'true');
        contentElement.focus();
        button.classList.add('hidden');
        saveButton.classList.remove('hidden');
    }
}
function saveContent(button, editButton, contentElement) {
    if (button.textContent === 'Save') {
        contentElement.setAttribute('contenteditable', 'false');
        button.classList.add('hidden');
        editButton.classList.remove('hidden');
    }
}
document.addEventListener('click', function (event) {
    var target = event.target;
    if (target.classList.contains('edit-button')) {
        var button = target;
        var parentSection = button.closest('.editable-section');
        if (parentSection) {
            var saveButton = parentSection.querySelector('.save-button');
            var contentElement = parentSection.querySelector('.editable-content');
            if (saveButton && contentElement) {
                toggleEditSave(button, saveButton, contentElement);
            }
        }
    }
    if (target.classList.contains('save-button')) {
        var button = target;
        var parentSection = button.closest('.editable-section');
        if (parentSection) {
            var editButton = parentSection.querySelector('.edit-button');
            var contentElement = parentSection.querySelector('.editable-content');
            if (editButton && contentElement) {
                saveContent(button, editButton, contentElement);
            }
        }
    }
    if (target.classList.contains('edit-profile-pic-button')) {
        var button = target;
        var parentSection_1 = button.closest('.editable-section');
        if (parentSection_1) {
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = function (e) {
                var input = e.target;
                if (input.files && input.files[0]) {
                    var file = input.files[0];
                    var reader_1 = new FileReader();
                    reader_1.onload = function () {
                        var imgElement = parentSection_1.querySelector('#profile-pic-output');
                        if (imgElement) {
                            imgElement.src = reader_1.result;
                        }
                    };
                    reader_1.readAsDataURL(file);
                }
            };
            fileInput.click();
        }
    }
    // if (target.id === 'print-resume') {
    //   window.print();
    // }
});
