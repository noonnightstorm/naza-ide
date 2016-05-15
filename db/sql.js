"use strict";

var DeleteData = [
  "drop table user;",
  "drop table file;",
  "drop table user_file_link;"
];

var CreateUser = [
  "create table if not exists user(",
  "id int(4) not null primary key auto_increment,",
  "name char(20) not null,",
  "account char(20) not null,",
  "password char(20) not null",
  ");"
].join(" ");

var CreateFileList = [
  "create table if not exists file(",
  "id int(4) not null primary key auto_increment,",
  "name char(20) not null,",
  "content text,",
  "type int(2)",
  ");"
].join(" ");


var CreateUserFileLink = [
  "create table if not exists user_file_link(",
  "id int(4) not null primary key auto_increment,",
  "uid int(4) not null,",
  "file_id int(4) not null,",
  "parent_id int(4) not null",
  ");"
].join(" ");

var GetFileList = [
  "select * from user_file_link",
  "inner join User on user_file_link.uid=User.id",
  "inner join file on user_file_link.file_id=file.id",
  "where user_file_link.parent_id={fileId} and User.id={uid};"
].join(" ");

var Login = [
  "select * from user where account='{account}' and password='{password}';"
].join(" ");

var getUser = [
  "select * from user where id='{uid}' ;"
].join(" ");

var CheckUserHasExits = [
  "select * from user where account='{account}';"
].join(" ");

var SignUp = [
  "INSERT INTO user (account,password,name) VALUES('{account}','{password}','{name}');"
].join(" ");

var getFile = [
  "select * from file where id='{fileId}';"
].join(" ");

var addFileLink = [
  "INSERT INTO user_file_link (uid,file_id,parent_id) VALUES('{uid}','{fileId}','{parentId}'); "
].join(" ");

var addFile = [
  "INSERT INTO file (name,content,type) VALUES('{name}','{content}','{type}'); "
].join(" ");

var delLink = [
  "delete from user_file_link where file_id='{fileId}'; "
].join(" ");

var delFile = [
  "delete from file where id='{fileId}'; "
].join(" ");

module.exports = {
  DeleteData: DeleteData,
  CreateUser: CreateUser,
  CreateFileList: CreateFileList,
  CreateUserFileLink: CreateUserFileLink,
  GetFileList: GetFileList,
  getFile: getFile,
  getUser: getUser,
  Login: Login,
  SignUp: SignUp,
  addFileLink: addFileLink,
  addFile: addFile,
  delLink: delLink,
  delFile: delFile,
  CheckUserHasExits: CheckUserHasExits
}
