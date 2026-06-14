/**
 * Google Apps Script — gắn vào Spreadsheet quản lý dữ liệu decor.
 *
 * Mỗi khi chủ site sửa một ô, script gọi webhook /api/revalidate của website
 * (Next.js) để làm mới cache → thay đổi hiển thị trong vài giây.
 *
 * CÀI ĐẶT:
 * 1. Mở Spreadsheet → Extensions → Apps Script, dán file này.
 * 2. Project Settings → Script Properties, thêm:
 *      WEBHOOK_URL       = https://<domain-cua-ban>/api/revalidate
 *      REVALIDATE_SECRET = <chuỗi giống hệt REVALIDATE_SECRET trong .env>
 * 3. Chạy hàm installTrigger() một lần (cấp quyền khi được hỏi).
 *    -> Dùng INSTALLABLE trigger vì simple onEdit() không gọi được UrlFetchApp.
 */

function installTrigger() {
  var ss = SpreadsheetApp.getActive();
  // Xóa trigger cũ để tránh trùng lặp.
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'handleEdit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('handleEdit').forSpreadsheet(ss).onEdit().create();
  SpreadsheetApp.getActive().toast('Đã cài trigger revalidate ✓');
}

function handleEdit(e) {
  var sheetName = e.range.getSheet().getName();
  // Bỏ qua tab log click (do website tự ghi).
  if (sheetName === 'Clicks') return;
  callRevalidate(sheetName);
}

function callRevalidate(sheetName) {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty('WEBHOOK_URL');
  var secret = props.getProperty('REVALIDATE_SECRET');
  if (!url || !secret) {
    Logger.log('Thiếu WEBHOOK_URL hoặc REVALIDATE_SECRET trong Script Properties');
    return;
  }
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ secret: secret, sheet: sheetName }),
    muteHttpExceptions: true,
  });
  Logger.log('Revalidate %s -> %s', sheetName, res.getResponseCode());
}

/** Menu "Tổ Ấm → Revalidate ngay" để chủ site ép làm mới thủ công. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Tổ Ấm')
    .addItem('Revalidate ngay (toàn bộ)', 'revalidateNow')
    .addItem('Cài đặt trigger tự động', 'installTrigger')
    .addToUi();
}

function revalidateNow() {
  callRevalidate('Products'); // tag 'all' luôn được bust nên làm mới mọi trang
  SpreadsheetApp.getActive().toast('Đã gửi yêu cầu revalidate ✓');
}
