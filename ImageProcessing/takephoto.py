import cv2
video_capture = cv2.VideoCapture(0)
i = 0
while True:
    _,frame = video_capture.read()
    cv2.imshow("test",frame)
    if cv2.waitKey(1) & 0xFF == ord('p'):
        cv2.imwrite('pic'+str(i)+'.png', frame)
        i += 1
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
        
video_capture.release()
cv2.destroyAllWindows()