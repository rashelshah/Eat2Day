-- Fix to add VENDOR role to users table
-- This script updates the role enum to include VENDOR

USE tastetrack_db;

-- Modify the role column to include VENDOR
ALTER TABLE users MODIFY COLUMN role ENUM('CUSTOMER', 'ADMIN', 'VENDOR') NOT NULL DEFAULT 'CUSTOMER';

-- Add owner_id column to restaurants table (ignore error if it already exists)
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'tastetrack_db' 
    AND TABLE_NAME = 'restaurants' 
    AND COLUMN_NAME = 'owner_id'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE restaurants ADD COLUMN owner_id BIGINT', 
    'SELECT "Column owner_id already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint (ignore error if it already exists)
SET @constraint_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = 'tastetrack_db'
    AND TABLE_NAME = 'restaurants'
    AND CONSTRAINT_NAME = 'fk_restaurant_owner'
);

SET @sql2 = IF(@constraint_exists = 0,
    'ALTER TABLE restaurants ADD CONSTRAINT fk_restaurant_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL',
    'SELECT "Constraint fk_restaurant_owner already exists" AS message');
PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Verify the changes
SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'tastetrack_db' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'role';
