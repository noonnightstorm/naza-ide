# naza-ide

### Login

* withoutLogin interface
```
path: /api/withoutLogin
method: GET
```

* login interface

```
path: /api/login
method: POST
param: {
  account:,
  password:
}
```

* sign up interface
```
path: /api/signUp
method: POST
param: {
  account:,
  password:,
  name:
}
```


### File

* get file list interface
```
path: /api/getFileList
method: GET
param: {
  id:1 
}
result:
{
  code: ,
  data: [{
  	id: ,
	parentId: ,
	name: ,
	type: ,
	content:
  }]
}
```

* add file interface
```
path: /api/addFile
method: POST
param: {
  parentId: ,
  name: ,
  type: 
}
```

* delete file interface
```
path: /api/delFile/
method: DELETE
param: {
  id:,
}
```
