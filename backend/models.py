from pydantic import BaseModel # type: ignore

class User(BaseModel):
    name: str
    email: str
    password: str
    age: int

class LoginUser(BaseModel):
    email: str
    password: str