DROP INDEX [Order].uidx_order_ordernumber;
ALTER TABLE [Order] ALTER COLUMN OrderNumber VARCHAR(14) NOT NULL;
CREATE UNIQUE INDEX uidx_order_ordernumber ON [Order] (OrderNumber);
