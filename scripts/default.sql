INSERT INTO `Functions` (`id`, `name`)
VALUES
	('1','MENU:DASHBOARD'),
	('2','MENU:SALES'),
	('3','MENU:INVENTORY'),
	('4','MENU:CUSTOMER');


INSERT INTO `Shops` (`id`, `name`)
VALUES
	('04ff0cdd-273f-4d50-918a-7c87bdff2407','shop_2'),
	('927b92eb-49a9-4de2-832c-b90203c5ad85','shop_1');
	
INSERT INTO `Groups` (`id`, `name`)
VALUES
	('1','SUPERADMIN'),
	('2','ADMIN');	

INSERT INTO `Users` (`id`, `role`, `shopsId`, `username`, `password`, `email`, `refreshToken`, `deviceId`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`)
VALUES
	('38fe5ae4-7fa2-463b-afa1-4679e1c918a1','1','927b92eb-49a9-4de2-832c-b90203c5ad85','admin','$2b$10$YXottUnMtSekaAxqIpkv/OSkijashakPHe90P3.wJQ9z7QWEvsF/y',NULL,NULL,NULL,'system','system','2023-05-05 09:26:36.348','2023-07-16 14:56:22.277'),
	('6dd9bc68-3bad-4595-8894-1f840810fbcb','1','04ff0cdd-273f-4d50-918a-7c87bdff2407','first','$2b$10$naEmtTOJ8eg.ZmLtMDxkYuDyDhLlmrn/Z3rtRUxbDH3IDRUiymTjC',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkZDliYzY4LTNiYWQtNDU5NS04ODk0LTFmODQwODEwZmJjYiIsImlhdCI6MTY4OTY4Nzg4MCwiZXhwIjoxNjkwMjkyNjgwfQ.MJAJmtkPOwjiQBh2T9XTCHBQOdNjXp8Jr8xkBtcLKGs',NULL,'system','system','2023-07-13 10:12:14.093','2023-07-18 13:44:45.223'),
	('e4f4c8ef-1110-44f5-ba81-943449681e3f','2','927b92eb-49a9-4de2-832c-b90203c5ad85','admin2','$2b$10$8MOtT6p7xvLXAFWzu6U3lurEQ9KA1R17CVcka5BNruu3va6rNdWmK',NULL,NULL,NULL,'system','system','2023-05-12 10:47:52.907','2023-06-17 11:45:33.437');


INSERT INTO `GroupFunctions` (`id`, `functionId`, `groupId`, `create`, `update`, `view`)
VALUES
	('1','1','1',1,1,1),
	('2','2','1',1,1,1),
	('3','3','1',1,1,1),
	('4','4','1',1,1,1),
	('5','1','2',0,0,1),
	('6','2','2',0,0,1),
	('7','3','2',0,0,1),
	('8','4','2',0,0,1);	
	
