-- Create function to populate default system with public API todos
-- This function runs automatically whenever a new user is created
CREATE OR REPLACE FUNCTION create_default_system_with_public_todos()
RETURNS TRIGGER AS $$
DECLARE
    -- Variable to store the ID of the newly created system
    new_system_id INTEGER;
BEGIN
    -- Create the default "PUBLIC API" system for the new user
    -- NEW.id refers to the ID of the user that was just inserted
    INSERT INTO systems (user_id, name, is_default)
    VALUES (NEW.id, 'PUBLIC API', TRUE)
    -- Capture the generated system ID and store it in the variable
    RETURNING id INTO new_system_id;
    
    -- Insert a placeholder todo to show the user while real todos are being fetched
    -- This placeholder will be deleted by the backend and replaced with real API data
    INSERT INTO todos (user_id, system_id, title, completed)
    VALUES 
        (NEW.id, new_system_id, 'Loading public todos...', FALSE);
    
    -- Return the new user row (required for AFTER INSERT triggers)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it already exists (for safe re-running of migrations)
DROP TRIGGER IF EXISTS after_user_registration ON users;

-- Create trigger that fires automatically after a new user is inserted
-- FOR EACH ROW means this runs once for every user created
CREATE TRIGGER after_user_registration
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_system_with_public_todos();