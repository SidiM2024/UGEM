document.addEventListener("DOMContentLoaded", function () {
    let candidateList = JSON.parse(localStorage.getItem("candidates")) || [];
    const form = document.getElementById("candidateForm");
    const tableBody = document.getElementById("candidateList");
    const popupForm = document.getElementById("popupForm");
    const addNewCandidateBtn = document.getElementById("addNewCandidateBtn");
    const closePopup = document.getElementById("closePopup");
    let editingIndex = null;

    // فتح النافذة عند الضغط على "إضافة مرشح جديد"
    addNewCandidateBtn.addEventListener("click", function () {
        popupForm.style.display = "flex";
    });

    // إغلاق النافذة عند الضغط على "X"
    closePopup.addEventListener("click", function () {
        popupForm.style.display = "none";
    });

    // إغلاق النافذة عند الضغط خارجها
    window.addEventListener("click", function (event) {
        if (event.target === popupForm) {
            popupForm.style.display = "none";
        }
    });

    // إضافة مرشح جديد
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const fullName = document.getElementById("fullName").value;
        const phone = document.getElementById("phone").value;
        const faculty = document.getElementById("faculty").value;
        const specialty = document.getElementById("specialty").value;
        const address = document.getElementById("address").value;
        const imageFile = document.getElementById("image").files[0];

        let imageURL = "placeholder.jpg"; // صورة افتراضية
        if (imageFile) {
            imageURL = URL.createObjectURL(imageFile);
        }

        const newCandidate = {
            id: candidateList.length + 1,
            image: imageURL,
            fullName,
            phone,
            faculty,
            specialty,
            address
        };

        if (editingIndex !== null) {
            candidateList[editingIndex] = newCandidate;
            editingIndex = null;
        } else {
            candidateList.push(newCandidate);
        }

        localStorage.setItem("candidates", JSON.stringify(candidateList));
        updateTable();
        form.reset();
        popupForm.style.display = "none"; // إغلاق النافذة بعد الإضافة
    });

    function updateTable() {
        tableBody.innerHTML = ""; // إعادة تحميل الجدول

        candidateList.forEach((candidate, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${candidate.image}" alt="الصورة" style="width: 50px; height: 50px; border-radius: 50%;"></td>
                <td>${candidate.fullName}</td>
                <td>${candidate.phone}</td>
                <td>${candidate.faculty}</td>
                <td>${candidate.specialty}</td>
                <td>${candidate.address}</td>
                <td>
                    <button class="btn edit-btn" onclick="editCandidate(${index})">تعديل</button>
                    <button class="btn delete-btn" onclick="deleteCandidate(${index})">حذف</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // حذف مرشح
    window.deleteCandidate = function (index) {
        if (confirm("هل تريد حذف هذا المرشح؟")) {
            candidateList.splice(index, 1); // حذف المرشح من القائمة
            localStorage.setItem("candidates", JSON.stringify(candidateList)); // تحديث localStorage
            updateTable(); // إعادة تحميل الجدول
        }
    };

    // تعديل مرشح
    window.editCandidate = function (index) {
        const candidate = candidateList[index];
        document.getElementById("fullName").value = candidate.fullName;
        document.getElementById("phone").value = candidate.phone;
        document.getElementById("faculty").value = candidate.faculty;
        document.getElementById("specialty").value = candidate.specialty;
        document.getElementById("address").value = candidate.address;

        editingIndex = index; // تعيين المؤشر إلى العنصر المراد تعديله

        popupForm.style.display = "flex"; // إظهار نافذة التعديل
    };

    updateTable(); // تحديث الجدول عند تحميل الصفحة
});
