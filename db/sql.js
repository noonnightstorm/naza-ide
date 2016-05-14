"use strict";

var CreateUser = [
  "create table if not exists user(",
  "id int(4) not null primary key auto_increment,",
  "name char(20) not null,",
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
  "where user_file_link.parent_id={id};"
].join(" ");

module.exports = {
  CreateUser: CreateUser,
  CreateFileList: CreateFileList,
  CreateUserFileLink: CreateUserFileLink,
  GetFileList: GetFileList
}
