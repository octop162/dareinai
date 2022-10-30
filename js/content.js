/**
 * ポップアップからメッセージを受け取り、メンバーリストを返す
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "GET_MEMBERS") {
    let memberList = {};
    let members = document.querySelectorAll(
      "div[role='list'] > div[role='listitem'] > div > div > div > span:first-child"
    );
    for (let member of members) {
      memberList[member.textContent] = "";
    }
    sendResponse(Object.keys(memberList));
    return true;
  }
});
