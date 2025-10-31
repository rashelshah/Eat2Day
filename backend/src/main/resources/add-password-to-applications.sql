-- Add password column to restaurant_applications table
USE tastetrack_db;

-- Check if column exists and add it
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'tastetrack_db' 
    AND TABLE_NAME = 'restaurant_applications' 
    AND COLUMN_NAME = 'password'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE restaurant_applications ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT ''''', 
    'SELECT "Column password already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the change
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'tastetrack_db' 
AND TABLE_NAME = 'restaurant_applications';
