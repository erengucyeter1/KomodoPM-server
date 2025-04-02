-- Eski trigger ve fonksiyonları temizle
DROP TRIGGER IF EXISTS update_user_permissions_trigger ON "user";
DROP TRIGGER IF EXISTS update_users_on_role_change_trigger ON role;
DROP FUNCTION IF EXISTS update_user_permissions_from_roles();
DROP FUNCTION IF EXISTS update_users_permissions_on_role_change();

-- 1. Kullanıcının rolleri değiştiğinde permissions alanını güncelleyen fonksiyon
CREATE OR REPLACE FUNCTION update_user_permissions_from_roles()
RETURNS TRIGGER AS $$
BEGIN
    -- Kullanıcının permissions alanını sıfırla
    NEW.permissions = '{}';
    
    -- Kullanıcının her rolü için ilgili izinleri ekle
    IF array_length(NEW.roles, 1) > 0 THEN
        -- Rollerin permissions değerlerini topla
        NEW.permissions = (
            SELECT array_agg(DISTINCT p)
            FROM (
                SELECT unnest(permissions) AS p
                FROM role
                WHERE id = ANY(NEW.roles::bigint[])
            ) AS permissions_list
        );
        
        -- Null durumunu kontrol et
        IF NEW.permissions IS NULL THEN
            NEW.permissions = '{}';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Bir rolün izinleri değiştiğinde o rolü kullanan tüm kullanıcıları güncelleyen fonksiyon
CREATE OR REPLACE FUNCTION update_users_on_role_change()
RETURNS TRIGGER AS $$
DECLARE
    affected_user record;
BEGIN
    -- Eğer permissions değişmediyse bir şey yapma
    IF OLD.permissions IS NOT DISTINCT FROM NEW.permissions THEN
        RETURN NEW;
    END IF;
    
    -- Bu role sahip tüm kullanıcıları bul
    FOR affected_user IN 
        SELECT id, username FROM "user" 
        WHERE NEW.id = ANY(roles)
    LOOP
        -- Her kullanıcı için, role silip tekrar ekle (bu işlem user trigger'ını tetikleyecek)
        UPDATE "user" 
        SET roles = array_remove(roles, NEW.id::int)
        WHERE id = affected_user.id;
        
        UPDATE "user" 
        SET roles = array_append(roles, NEW.id::int)
        WHERE id = affected_user.id;
        
        RAISE NOTICE 'User % permissions updated due to role % change', affected_user.username, NEW.id;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Kullanıcı trigger'ı - roles değiştiğinde çalışır
CREATE TRIGGER update_user_permissions_trigger
BEFORE INSERT OR UPDATE OF roles ON "user"
FOR EACH ROW
EXECUTE FUNCTION update_user_permissions_from_roles();

-- 4. Rol trigger'ı - rol permissions değiştiğinde çalışır
CREATE TRIGGER update_role_permissions_trigger
AFTER UPDATE OF permissions ON "role"
FOR EACH ROW
EXECUTE FUNCTION update_users_on_role_change();