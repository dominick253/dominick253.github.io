document.addEventListener("DOMContentLoaded", (event) => {
  document
    .getElementById("upload-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      var formData = new FormData();
      formData.append("file", document.getElementById("file-input").files[0]);
      formData.append("uploaded_by", "Dom"); // Replace 'username' with the actual username

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          console.log(data);
          fetchFileList();
        })
        .catch((error) => console.error(error));
    });

  function fetchFileList() {
    // Clear the current file list
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    // Fetch the list of available files from the server
    fetch("/api/files")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((file) => {
          const listItem = document.createElement("li");
          const downloadLink = document.createElement("a");
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("file-button");

          downloadLink.textContent = file.name;
          downloadLink.href = `/download/${file.id}`;
          downloadLink.setAttribute("target", "_blank"); // Open the link in a new tab

          deleteButton.textContent = "Delete";
          deleteButton.onclick = function () {
            deleteFile(file.id);
          };

          listItem.appendChild(downloadLink);
          listItem.appendChild(deleteButton);

          // Check if file is an image
          if (
            file.name.endsWith(".jpg") ||
            file.name.endsWith(".jpeg") ||
            file.name.endsWith(".png") ||
            file.name.endsWith(".gif")
          ) {
            const imagePreview = document.createElement("img");
            imagePreview.src = `/download/${file.id}`; // You might need to adjust this depending on how your API works
            listItem.appendChild(imagePreview);
          }

          fileList.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching file list:", error);
      });
  }

  // Call the function when the page loads
  fetchFileList();

  function deleteFile(fileId) {
    fetch("/api/files/" + fileId, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Refresh the file list after a successful delete
        fetchFileList();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
