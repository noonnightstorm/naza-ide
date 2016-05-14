# naza-ide

### Login

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

```
path: /api/getFileList
method: GET
param: {
  id:1 
}
result:
{
  data: [{
  	id: ,
	parentId: ,
	name: ,
	type: ,
	content:
  }]
}
```
