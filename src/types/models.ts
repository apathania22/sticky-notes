export type NoteType = {
  // unique numeric id
  id: number;   
  // left position inside the board (px)
  x: number;    
  // top position inside the board (px)
  y: number;    
  // width (px)
  w: number; 
  // height (px)  
  h: number;  
  // editable content  
  text: string; 
  // background color
  color: string;
};

export type Rect = { x: number; y: number; w: number; h: number };