from fastapi import FastAPI,UploadFile,Form, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Annotated
import sqlite3

con = sqlite3.connect('db.db',check_same_thread=False)
cur = con.cursor()

app = FastAPI()

rows = cur.execute(f"""
                    CREATE TABLE IF NOT EXISTS items (
	                    id INTEGER PRIMARY KEY,
	                    title TEXT NOT NULL,
	                    image BLOB,
	                    price INTEGER NOT NULL,
	                    description TEXT,
	                    place TEXT NOT NULL,
	                    insertAt INTEGER NOT NULL)
                    """)


@app.post('/items')
async def create_item(image:UploadFile,
                title:Annotated[str,Form()],
                price:Annotated[int,Form()],
                description:Annotated[str,Form()],
                place:Annotated[str,Form()],
                insertAt:Annotated[str,Form()]):
    
    image_bytes = await image.read()
    cur.execute(f"""
                INSERT INTO items
                (title,image,price,description,place, insertAt)
                values ('{title}','{image_bytes.hex()}',{price},'{description}','{place}',{insertAt})
                """)
    con.commit()
    return '200'
    
@app.get('/items')
async def get_items():
    con.row_factory = sqlite3.Row #컬럼이름도 같이 불러오는 문법. 이것이 없으면['id','제목','설명']. 이것을 추가하면 [['id':1],['title':'제목'],['description':'설명']...]
    cur=con.cursor()
    rows = cur.execute(f"""
                       SELECT * from items
                       """).fetchall()
    
    return JSONResponse(jsonable_encoder(
        dict(row) for row in rows
        )) #dict(row) for row in rows를 추가하면 [[id:1],[title:'제목'],[description:'설명']...]이렇게 바뀜. 즉 키로 바뀜



@app.get('/images/{item_id}')
async def get_img(item_id):
    cur=con.cursor()
    img_byte = cur.execute(f"""
                       SELECT image FROM items WHERE id={item_id}
                       """).fetchone()[0]
    return Response(content=bytes.fromhex(img_byte))

app.mount("/", StaticFiles(directory="frontend",html=True), name="frontend")
