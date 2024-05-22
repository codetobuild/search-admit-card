const searchAdmitBtn = document.getElementById("searchAdmitBtn");
const rollnoInput = document.getElementById("rollnoInput");

const ONLINE_STATUS = false;
// script.js
document
  .getElementById("searchAdmitBtn")
  .addEventListener("click", async () => {
    const rollnoInput = document.getElementById("rollnoInput");
    const inputValue = rollnoInput.value.trim();
    hideDownloadButton();
    if (inputValue.length === 0) {
      showModal({ title: "Please enter your roll number" });
      resetRollInput();
      return;
    }
    const rollnumber = parseInt(inputValue);

    if (rollnumber < 1 || rollnumber > 50000 || isNaN(rollnumber)) {
      showModal({
        title: "Please enter a valid roll number.",
      });
      resetRollInput();
      return;
    }

    try {
      const response = await fetch(`/api/v1/admit/${inputValue}`);
      console.log("response status", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("data", data);

        if (!data?.fileData) {
          throw new Error("An error occurred while processing your request");
        }
        const downloadLinkElem = document.getElementById("downloadLink");
        const viewLinkElem = document.getElementById("viewLink");

        const { filename, fileDriveId } = data.fileData;

        const viewUrl = `https://drive.google.com/file/d/${fileDriveId}/view`;
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileDriveId}`;

        downloadLinkElem.href = downloadUrl;
        downloadLinkElem.download = filename;

        viewLinkElem.href = viewUrl;

        if (data?.visitorCount) {
          const visitorCountValueElem =
            document.getElementById("visitorCountValue");
          function roundToNext100(number) {
            return Math.ceil(number / 100) * 100;
          }
          const count = roundToNext100(data.visitorCount);
          visitorCountValueElem.innerText = String(count) + "+";
        }

        showAdmitFoundSuccess();
        showDownloadButton();
        resetRollInput();
        return;
      }

      if (response.status === 404) {
        showModal({
          title: "Result not found",
          primary: "Please check your roll number and try again",
        });
        resetRollInput();
      } else if (response.status === 500) {
        throw new Error("Internal server error");
      } else {
        throw new Error("An error occurred while processing your request");
      }
    } catch (error) {
      showModal({ title: error.message });
      resetRollInput();
    }
  });

function resetRollInput() {
  rollnoInput.value = "";
}
function showAdmitFoundSuccess() {
  const messageContainer =
    document.getElementsByClassName("messageContainer")[0];
  const primaryText = messageContainer.getElementsByClassName("primary")[0];
  const secondaryText = messageContainer.getElementsByClassName("secondary")[0];
  primaryText.innerText = "Your admit card is availabe.";
  secondaryText.innerText = "Download or view it now.";
}

function showDownloadButton() {
  const downloadBtnContainer = document.getElementsByClassName(
    "downloadBtnContainer"
  )[0];
  downloadBtnContainer.style.display = "flex";
}

function hideDownloadButton() {
  const downloadBtnContainer = document.getElementsByClassName(
    "downloadBtnContainer"
  )[0];
  downloadBtnContainer.style.display = "none";
}

async function setDownloadLink(rollNo) {
  try {
    const response = await fetch(`/api/v1/admit/${rollNo}`);
    if (response.ok) {
      const data = await response.json();
      const downloadLink = document.getElementById("downloadLink");
      downloadLink.href = data.path;
      downloadLink.download = data.path.split("/").pop();
    } else {
      console.error("File not found or error occurred");
    }
  } catch (error) {
    console.error("Error fetching file:", error);
  }
}

function showModal(message) {
  console.log("show modal", message);
  const { title, primary } = message;
  var modal = document.getElementById("myModal");

  const closeBtn = document.getElementById("modal-close-btn");
  const modalTitleElem = document.getElementById("modal-title");
  const modalPrimaryElem = document.getElementById("modal-primary");
  if (title && title.length > 0) {
    modalTitleElem.innerText = title;
  }
  if (primary && primary.length > 0) {
    modalPrimaryElem.innerText = primary;
  }

  modal.style.display = "flex";

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

document
  .getElementById("officialSiteLink")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    const confirmation = confirm(
      "You are about to be redirected to the official website. Do you want to proceed?"
    );
    const OFFICIAL_WEBSITE_URL = "https://ttaadc.gov.in/";

    if (confirmation) {
      window.open(OFFICIAL_WEBSITE_URL, "_blank"); // Open link in new tab
    }
  });

document
  .getElementById("downloadLink")
  .addEventListener("click", function (event) {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      event.preventDefault();
      const downloadUrl = this.getAttribute("href");
      window.open(downloadUrl, "_blank");
    }
  });
