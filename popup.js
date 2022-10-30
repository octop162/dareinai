const MEET_DOMAIN = "meet.google.com";

$(function () {
  // ポップアップ表示時にローカルストレージからメンバーをロード
  loadMembersList();

  // 不在確認クリック時にmeetのDOMから現参加者を取得する
  $("#confirm").on("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "GET_MEMBERS" }, showAbsentees);
    });
  });

  // 設定保存時クリック時にローカルストレージにメンバーを保存
  $("#save").on("click", function () {
    saveMembersList($("#participants").val());
  });
});

/**
 * 現参加者取得完了後、不参加者のリストを表示する
 * @param {array} response
 * @returns
 */
function showAbsentees(membersObject) {
  // 不明エラー処理
  if (membersObject === undefined) {
    showMessage("<li>エラーが発生しました。</li>");
    return;
  }
  // メンバー取得
  let members = Object.values(membersObject);
  if (members.length == 0) {
    showMessage("<li>ユーザーを開いてださい。</li>");
    return;
  }
  // 現参加者取得
  let participants = $("#participants").val().split("\n");
  console.dir(participants);
  if (participants.length === 0 || participants[0] === "") {
    showMessage("<li>メンバーを追加してください。</li>");
    return;
  }
  // 不参加者リスト表示
  let absentees_list = listAbsentees(participants, members);
  showArrayList(absentees_list);
}

/**
 * 不参加者のリストを作成する
 * @param {array} participants 現在の参加者のリスト
 * @param {array} members 参加するべきメンバーのリスト
 * @returns {array} 不参加者リスト
 */
function listAbsentees(participants, members) {
  let absentees_list = [];
  for (let participant of participants) {
    if (!members.includes(participant)) {
      absentees_list.push(participant);
    }
  }
  return absentees_list;
}

/**
 * メッセージ欄にテキストを表示する
 * @param {string} message 表示したいメッセージ
 */
function showMessage(message) {
  $("#message").html(message);
}

/**
 * メッセージ欄に複数リスト表示する
 * 内部のエスケープしたい意図がある
 *
 * @param {array} messages 表示したい配列
 */
function showArrayList(messages) {
  $("#message").text("");
  for (message of messages) {
    $("<li>").text(message).appendTo("#message");
  }
}

/**
 * ローカルストレージに保存する
 * meet以外は無視する
 * URLごとに個別に保存
 * @param {string} text 保存したい文字列
 */
function saveMembersList(text) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    let domain = url.split("/")[2];
    let meet_id = url.split("/")[3];
    if (domain !== MEET_DOMAIN) {
      console.log(`skip: ${domain}`);
      showMessage("<li>meet以外のURLでは保存できません。</li>");
      return;
    }
    chrome.storage.local.set({ [meet_id]: text }, function () {
      console.log("save:" + text);
      showMessage("<li>保存しました。</li>");
    });
  });
}

/**
 * ローカルストレージから復元する
 * meet以外は無視する
 * URLごとに個別に保存
 */
function loadMembersList() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    let domain = url.split("/")[2];
    let meet_id = url.split("/")[3];
    if (domain !== MEET_DOMAIN) {
      console.log(`skip: ${domain}`);
      return;
    }
    chrome.storage.local.get([meet_id], function (text) {
      if (Object.values(text).length === 0) {
        showMessage(`<li>${meet_id}にデータはありません。</li>`);
        return;
      }
      console.log("load:" + text[meet_id]);
      $("#participants").val(text[meet_id]);
      showMessage(`<li>${meet_id}をロードしました。</li>`);
    });
  });
}
