/**
 * @typedef {Object} DatabaseInfo
 * @property {string} instance - CloudSQLインスタンス接続名
 * @property {string} user - CloudSQL接続ユーザ名
 * @property {string} password - CloudSQL接続パスワード
 */

/**
 * @typedef {Object} MyData
 * @property {string} name - INSERT/UPDATE/DELETEで使用するユーザ名
 * @property {string} mail - INSERT/DELETEで使用するメールアドレス
 */

/**
 * データベース接続情報をScriptPropertyから取得します
 * @returns {DatabaseInfo}　CloudSQL接続情報
 */
function getDatabaseInfo() {
  const databaseInfo = {
    instance: PropertiesService.getScriptProperties().getProperty('DATABASE'),
    user: PropertiesService.getScriptProperties().getProperty('DB_USER'),
    password: db_password = PropertiesService.getScriptProperties().getProperty('DB_PASSWORD')
  }
  return databaseInfo;
}

/**
 * ScriptPropertyから取得したCloudSQL接続情報の値が設定されているかチェックします
 * @param {DatabaseInfo} databaseInfo - CloudSQL接続情報
 * @return {Boolean} true: 全ての値が設定されている<br>false: いずれかの値が設定されていない
 */
function checkDatabaseInfo(databaseInfo) {
  if (databaseInfo.instance === null) {
    Logger.log("ScriptProperty 'DATABASE' is null, Please set value.");
    return false;
  }
  if (databaseInfo.user === null) {
    Logger.log("ScriptProperty 'DB_USER' is null, Please set value.");
    return false;
  }
  if (databaseInfo.password === null) {
    Logger.log("ScriptProperty 'DB_PASSWORD' is null, Please set value.");
    return false;
  }
    return true;
}

/**
 * DB操作用データ情報をScriptPropertyから取得します
 * @return {MyData} DB操作用データ情報
 */
function getMyData() {
  const myData = {
    name: PropertiesService.getScriptProperties().getProperty('NAME'),
    mail: PropertiesService.getScriptProperties().getProperty('MAIL_ADDRESS')
  }
  return myData;
}

/**
 * ScriptPropertyから取得したDB操作用データ情報の値が設定されているかチェックします
 * @param {MyData} DB操作用データ情報
 * @return {Boolean} true: 全ての値が設定されている<br>false: いずれかの値が設定されていない
 */
function checkMyData(myData) {
  if (myData.name === null) {
    Logger.log("ScriptProperty 'NAME' is null, Please set value.");
    return false;
  }
  if (myData.mail === null) {
    Logger.log("ScriptProperty 'MAIL_ADDRESS' is null, Please set value.");
    return false;
  }
  return true;
}

/**
 * CloudSQLに接続しpersiondata表をselectします。
 */
function getList() {
  const databaseInfo = getDatabaseInfo();
  if (checkDatabaseInfo(databaseInfo) === false){
    return false;
  }
  const conn = Jdbc.getCloudSqlConnection(databaseInfo.instance,databaseInfo.user,databaseInfo.password);
  const stmt = conn.createStatement();
  stmt.setMaxRows(100);
  const rs = stmt.executeQuery("select * from persondata");
  while(rs.next()) {
    var id = rs.getString("id");
    var name = rs.getString("name");
    var mail = rs.getString("mail");
    var res = "id=" + id + ", name=" + name + ", mail=" + mail;
    Logger.log(res);
  }
  rs.close();
  stmt.close();
  conn.close();
}

/**
 * CloudSQLに接続しpersiondata表にNAMEのレコードをinsertします。
 */
function setList() {
  const databaseInfo = getDatabaseInfo();
  if (checkDatabaseInfo(databaseInfo) === false){
    return false;
  }
  const myData = getMyData();
  if (checkMyData(myData) === false){
    return false;
  }
  const conn = Jdbc.getCloudSqlConnection(databaseInfo.instance,databaseInfo.user,databaseInfo.password);
  const stmt = conn.createStatement();
  const rs = stmt.executeUpdate("insert into persondata (name,mail) values ('" + myData.name + "','" + myData.mail + "')");
  stmt.close();
  conn.close();
  Logger.log("execute insert SQL command.");
}

/**
 * CloudSQLに接続しpersiondata表のNAMEのレコードをupdateします。
 */
function updateList() {
  const databaseInfo = getDatabaseInfo();
  if (checkDatabaseInfo(databaseInfo) === false){
    return false;
  }
  const myData = getMyData();
  if (checkMyData(myData) === false){
    return false;
  }
  const conn = Jdbc.getCloudSqlConnection(databaseInfo.instance,databaseInfo.user,databaseInfo.password);
  const stmt = conn.createStatement();
  const updateMailAddress = "update@example.com"
  const rs = stmt.executeUpdate("update persondata set mail = '" + updateMailAddress + "' where name = '" + myData.name + "'");
  stmt.close();
  conn.close();
  Logger.log("execute update SQL command.");
}

/**
 * CloudSQLに接続しpersiondata表からNAMEのレコードをdeleteします。
 */
function deleteList() {
  const databaseInfo = getDatabaseInfo();
  if (checkDatabaseInfo(databaseInfo) === false){
    return false;
  }
  const myData = getMyData();
  if (checkMyData(myData) === false){
    return false;
  }
  const conn = Jdbc.getCloudSqlConnection(databaseInfo.instance,databaseInfo.user,databaseInfo.password);
  const stmt = conn.createStatement();
  const rs = stmt.executeUpdate("delete from persondata where name = '" + myData.name + "'");
  stmt.close();
  conn.close();
  Logger.log("execute delete SQL command.");
}
