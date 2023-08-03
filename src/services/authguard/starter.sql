INSERT INTO `Functions` (`id`, `name`)
VALUES
	('1','MENU:DASHBOARD'),
	('2','MENU:SALES'),
	('3','MENU:INVENTORY'),
	('4','MENU:CUSTOMER');
	
INSERT INTO `Shops` (`id`, `name`, `createdAt`, `createdBy`, `description`, `updatedAt`, `updatedBy`)
VALUES
	('04ff0cdd-273f-4d50-918a-7c87bdff2407','shop_2','2023-07-29 17:25:56.398','system',NULL,'2023-07-29 17:25:56.398','system'),
	('927b92eb-49a9-4de2-832c-b90203c5ad85','shop_1','2023-07-29 17:25:56.398','system',NULL,'2023-07-29 17:25:56.398','system');
	
	
INSERT INTO `Groups` (`id`, `name`, `shopsId`)
VALUES
	('1','SUPERADMIN','927b92eb-49a9-4de2-832c-b90203c5ad85'),
	('2','ADMIN','927b92eb-49a9-4de2-832c-b90203c5ad85'),
	('3','SUPERADMIN','04ff0cdd-273f-4d50-918a-7c87bdff2407');	

INSERT INTO `GroupFunctions` (`id`, `functionId`, `groupId`, `create`, `view`, `update`)
VALUES
	('1','1','1',1,1,1),
	('10','2','3',1,1,1),
	('11','3','3',1,1,1),
	('12','4','3',1,1,1),
	('2','2','1',1,1,1),
	('3','3','1',1,1,1),
	('4','4','1',1,1,1),
	('5','1','2',0,1,0),
	('6','2','2',0,1,0),
	('7','3','2',0,1,0),
	('8','4','2',0,1,0),
	('9','1','3',1,1,1);	

INSERT INTO `Tasks` (`id`, `name`, `functionId`)
VALUES
	('1','INVP','3'),
	('2','INUP','3'),
	('3','INTU','3'),
	('4','INBC','3');
	
INSERT INTO `GroupTasks` (`id`, `groupId`, `taskId`, `shopsId`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`)
VALUES
	('3b8be49d-3405-4576-ae4c-c5869af5a96f','3','1','04ff0cdd-273f-4d50-918a-7c87bdff2407','system','system','2023-07-29 17:55:01.115','2023-07-29 17:55:01.115'),
	('9eae0ca1-92d1-4bd9-8950-d59b61b0f05e','3','4','04ff0cdd-273f-4d50-918a-7c87bdff2407','system','sysrem','2023-07-30 17:55:40.931','2023-07-30 17:55:40.931'),
	('dbcb30b3-4cf9-4661-b009-714a5d4bff2a','3','2','04ff0cdd-273f-4d50-918a-7c87bdff2407','system','system','2023-07-29 18:28:42.438','2023-07-29 18:28:42.438');
	
INSERT INTO `Users` (`id`, `role`, `shopsId`, `username`, `password`, `email`, `refreshToken`, `deviceId`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`)
VALUES
	('38fe5ae4-7fa2-463b-afa1-4679e1c918a1','1','927b92eb-49a9-4de2-832c-b90203c5ad85','admin','$2b$10$YXottUnMtSekaAxqIpkv/OSkijashakPHe90P3.wJQ9z7QWEvsF/y',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4ZmU1YWU0LTdmYTItNDYzYi1hZmExLTQ2NzllMWM5MThhMSIsImRldmljZUlkIjoiNGQzNzMzZjMtYzY5Ni00Y2E3LWI3ZmEtNGQ5Y2E4N2M0ZDcwIiwiaWF0IjoxNjkwNjM5NDg0LCJleHAiOjE2OTEyNDQyODR9.P8epvG8aVbqoeJbWvqROsvF56AfpfuYvFrRmgp0rioU','4d3733f3-c696-4ca7-b7fa-4d9ca87c4d70','system','system','2023-05-05 09:26:36.348','2023-07-29 14:04:44.094'),
	('6dd9bc68-3bad-4595-8894-1f840810fbcb','3','04ff0cdd-273f-4d50-918a-7c87bdff2407','first','$2b$10$naEmtTOJ8eg.ZmLtMDxkYuDyDhLlmrn/Z3rtRUxbDH3IDRUiymTjC',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkZDliYzY4LTNiYWQtNDU5NS04ODk0LTFmODQwODEwZmJjYiIsImRldmljZUlkIjoiMWQzMmY0YTMtYjUyYy00NDlmLThlZTQtMjJmYjI3NGE1YmY5IiwiaWF0IjoxNjkwNzE3MjYwLCJleHAiOjE2OTEzMjIwNjB9.oY5C_UAWvoXmHyKAbQPNS03UISQ4HnBdpGaRc_FPmCA','1d32f4a3-b52c-449f-8ee4-22fb274a5bf9','system','system','2023-07-13 10:12:14.093','2023-07-30 11:41:00.287'),
	('e4f4c8ef-1110-44f5-ba81-943449681e3f','2','927b92eb-49a9-4de2-832c-b90203c5ad85','admin2','$2b$10$8MOtT6p7xvLXAFWzu6U3lurEQ9KA1R17CVcka5BNruu3va6rNdWmK',NULL,NULL,NULL,'system','system','2023-05-12 10:47:52.907','2023-06-17 11:45:33.437');

	