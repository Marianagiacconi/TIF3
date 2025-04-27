from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
class RegisterRequest(BaseModel):
    username: str
    password: str
    full_name: str
    email: str
    telefono: str
    direccion: str
    rol: str = "usuario"
class UserOut(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    telefono: str
    direccion: str
    rol: str

    class Config:
        orm_mode = True
