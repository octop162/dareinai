/**
 * ポップアップからメッセージを受け取り、メンバーリストを配列として返す
 * HTML構造が変化した場合ここのセレクタを修正する
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
