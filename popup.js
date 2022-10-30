$(function () {
  loadMembersList();

  $("#confirm").on("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "GET_MEMBERS" }, responseProcess);
    });
  });

  $("#save").on("click", function () {
    saveMembersList($("#participants").val());
  });
});

function responseProcess(response) {
  let members = Object.values(response.members);
  console.dir(members);
  if (members.length == 0) {
    showMessage("<li>ユーザーを開いてださい。</li>");
    return;
  }
  let participants = $("#participants").val().split("\n");
  if (participants.length == 0) {
    showMessage("<li>メンバーを追加開いてださい。</li>");
    return;
  }
  let absentees_list = listAbsentees(participants, members);
  showMessage("<li>" + absentees_list.join("</li><li>") + "</li>");
}

function listAbsentees(participants, members) {
  let absentees_list = [];
  for (let participant of participants) {
    if (!members.includes(participant)) {
      absentees_list.push(participant);
    }
  }
  return absentees_list;
}

function saveMembersList(text) {
  chrome.storage.local.set({ members: text }, function () {
    console.log("save:" + text);
    showMessage("<li>保存しました。</li>");
  });
}

function loadMembersList() {
  chrome.storage.local.get(["members"], function (text) {
    console.log("load:" + text["members"]);
    $("#participants").val(text["members"]);
  });
}

function showMessage(message) {
  $("#message").html(message);
}
