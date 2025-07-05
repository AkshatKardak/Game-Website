import tkinter as tk #Used for GUI purpose by button labels and images
from time import  strftime #We can decide current time and date


root = tk.Tk() #used to display the elements in the window
root.title("Digital Clock")

#function to display time and date

def time():
    string = strftime("%H:%M:%S %p \n %D")
    label.config(text=string)
    label.after(1000,time)

label = tk.Label(root, font = ('Arial', 100 , 'bold'), background = 'blue' , foreground = 'black')
label.pack(anchor = 'center')

time()

root.mainloop()