-- Fix Restaurant-Vendor Association
-- This script diagnoses and fixes the issue where restaurants created via applications
-- are not properly associated with their vendor accounts

-- Step 1: Check if there are restaurants without owners
SELECT 
    r.id,
    r.name,
    r.address,
    r.owner_id,
    'Restaurant without owner' AS issue
FROM restaurants r
WHERE r.owner_id IS NULL
ORDER BY r.id DESC;

-- Step 2: Check vendor accounts and their restaurants
SELECT 
    u.id AS user_id,
    u.email,
    u.role,
    u.first_name,
    u.last_name,
    r.id AS restaurant_id,
    r.name AS restaurant_name
FROM users u
LEFT JOIN restaurants r ON r.owner_id = u.id
WHERE u.role = 'VENDOR'
ORDER BY u.id;

-- Step 3: Check approved applications and match them with users and restaurants
SELECT 
    ra.id AS application_id,
    ra.name AS restaurant_name,
    ra.email AS vendor_email,
    ra.status,
    u.id AS user_id,
    u.role,
    r.id AS restaurant_id,
    r.name AS existing_restaurant_name,
    r.owner_id
FROM restaurant_applications ra
LEFT JOIN users u ON u.email = ra.email
LEFT JOIN restaurants r ON r.owner_id = u.id
WHERE ra.status = 'APPROVED'
ORDER BY ra.submitted_at DESC;

-- Step 4: Fix - Link restaurants to vendors based on application data
-- This will match restaurants by name with approved applications and set the correct owner
UPDATE restaurants r
INNER JOIN restaurant_applications ra ON r.name = ra.name AND ra.status = 'APPROVED'
INNER JOIN users u ON u.email = ra.email AND u.role = 'VENDOR'
SET r.owner_id = u.id
WHERE r.owner_id IS NULL;

-- Step 5: Verify the fix
SELECT 
    u.id AS user_id,
    u.email,
    u.role,
    u.first_name,
    u.last_name,
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.owner_id
FROM users u
INNER JOIN restaurants r ON r.owner_id = u.id
WHERE u.role = 'VENDOR'
ORDER BY u.id;
