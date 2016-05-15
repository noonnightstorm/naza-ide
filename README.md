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

* update user state cache interface
```
path: /api/updateFile
method: PUT
param: {
  cache: 
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

* get file info interface
```
path: /api/getFile
method: GET
param: {
  id:1 
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

* update file interface
```
path: /api/updateFile
method: PUT
param: {
  id: ,
  name: ,
  content: 
}
```
