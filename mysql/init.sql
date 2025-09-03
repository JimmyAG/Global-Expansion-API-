-- Create user with access from any host
CREATE USER IF NOT EXISTS 'expanders360_user'@'%' IDENTIFIED BY 'superSecretPassword';

-- Grant all privileges
GRANT ALL PRIVILEGES ON mysqldb.* TO 'expanders360_user'@'%';

FLUSH PRIVILEGES;