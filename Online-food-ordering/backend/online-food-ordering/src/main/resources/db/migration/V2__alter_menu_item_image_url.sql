-- Alter the menu_item table to increase the image_url column length
ALTER TABLE menu_item MODIFY COLUMN image_url VARCHAR(1000);

-- Alter the menu_item table to increase the description column length
ALTER TABLE menu_item MODIFY COLUMN description VARCHAR(1000); 