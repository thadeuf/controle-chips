-- Create the WhatsApp numbers table
CREATE TABLE IF NOT EXISTS celulares_whatsapp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contato TEXT NOT NULL,
  numero TEXT NOT NULL,
  cpf TEXT NOT NULL,
  ativado_em DATE,
  reativado_em DATE,
  aparelho TEXT NOT NULL,
  dias_ativo INTEGER,
  api TEXT,
  desconectado_em DATE,
  dias_desconectado INTEGER,
  recuperacao TEXT,
  recarregar_em DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_celulares_whatsapp_updated_at
BEFORE UPDATE ON celulares_whatsapp
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE celulares_whatsapp ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can CRUD celulares_whatsapp"
ON celulares_whatsapp
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
