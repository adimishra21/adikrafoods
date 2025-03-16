-- Drop foreign key constraints first
ALTER TABLE cart_item
DROP FOREIGN KEY FK1uobyhgl1wvgt1jpccia8xxs3,
DROP FOREIGN KEY FKcro8349ry4i72h81en8iw202g;

-- Drop columns that are no longer needed
ALTER TABLE cart_item
DROP COLUMN cart_id,
DROP COLUMN food_id,
DROP COLUMN total_price,
MODIFY COLUMN id bigint NOT NULL AUTO_INCREMENT;

-- Update existing columns and ensure proper types
ALTER TABLE cart_item
MODIFY COLUMN quantity int NOT NULL DEFAULT 1,
MODIFY COLUMN price double NOT NULL DEFAULT 0.0;

-- Add indexes for better performance
ALTER TABLE cart_item
ADD INDEX idx_user_menuitem (user_id, menu_item_id); 