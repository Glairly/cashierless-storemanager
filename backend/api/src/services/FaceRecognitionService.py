import base64
from PIL import Image
import face_recognition
from fastapi import HTTPException
import numpy as np
from sqlalchemy import text, func

from ..model.models import *

from ..libs.Utils import *

import io

from fastapi_sqlalchemy import db

class FaceRecognitionService():
    def endcoding_face(self, file: Image.Image):
        image_np = np.array(file)
        face_locations = face_recognition.face_locations(image_np)

        if not len(face_locations):
            raise HTTPException(status_code=400, detail="Couldn't find face")

        return face_recognition.face_encodings(image_np, face_locations)

    def create_face_id_none_commit(self, file: bytes):
        image = Utils.bytes_to_pil_image(file)
        face_encoded = self.endcoding_face(image)
        face_id = ClientFaceIdentity(face_encoded=face_encoded[0])

        return face_id
        
    def find_face_id(self, file: bytes):   
        image = Utils.bytes_to_pil_image(file)
        face_encoded = self.endcoding_face(image)[0]

        face_ids = db.session.query(ClientFaceIdentity).all()

        best_match = None
        best_distance = float('inf')
        
        for face_identity in face_ids:
            face_encoding = np.frombuffer(face_identity.face_encoded, dtype=np.float64)
            distance = face_recognition.face_distance([face_encoding], face_encoded)[0]
            
            if distance <= 0.5 and distance < best_distance:
                best_match = face_identity
                best_distance = distance

        if best_match is None:
            raise HTTPException(status_code=400, detail="Could not find face id")

        auth =  best_match.auth 
        if auth is None:
            raise HTTPException(status_code=400, detail="Face id is not exist or not found")

        return auth   

    def find_face_id_with_auth_id(self, auth_id : int, file: bytes):   
        image = Image.open(io.BytesIO(base64.b64decode(file))) 
        face_encoded = self.endcoding_face(image)   
        face_id = db.session.query(ClientFaceIdentity).filter(ClientFaceIdentity.auth.id == auth_id and face_recognition.face_distance(ClientFaceIdentity.face_encoded,face_encoded) <= 0.5 ).first()
        return face_id   
