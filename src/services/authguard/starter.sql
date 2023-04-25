INSERT INTO Functions (id, name) VALUES ("1", "MENU:DASHBOARD");
INSERT INTO Functions (id, name) VALUES ("2", "MENU:SALES");
INSERT INTO Functions (id, name) VALUES ("3", "MENU:INVENTORY");
INSERT INTO Functions (id, name) VALUES ("4", "MENU:CUSTOMER");

INSERT INTO Groups (id, name) VALUES ("1", 'ADMIN');

INSERT INTO GroupFunctions (id, functionId, groupId) VALUES ("1", "1", "1");
INSERT INTO GroupFunctions (id, functionId, groupId) VALUES ("2", "2", "1"); 
INSERT INTO GroupFunctions (id, functionId, groupId) VALUES ("3", "3", "1"); 
INSERT INTO GroupFunctions (id, functionId, groupId) VALUES ("4", "4", "1"); 
