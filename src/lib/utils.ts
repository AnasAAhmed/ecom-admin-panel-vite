import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const pageTitle = (title: string) => {
  return title
    .replace(/\//g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};

export const initialText=`<h2 style="margin-bottom: 8px;">📝 Product Description Guidelines</h2>
<ul>
  <li>Write a detailed and compelling description of the product.</li>
  <li>Use proper formatting — paragraphs, headings, bullet points, etc.</li>
  <li>Use <strong>image URLs only</strong> (uploaded elsewhere). Avoid using the image upload feature here to keep the content lightweight.</li>
  <li>You can include <strong>tables</strong> for things like size guides or technical specifications.</li>
  <li>You have to remove all of this Guidelines and example first before typing anything</li>
  <li>The value of detail description is consider null if you do not type or remove anything</li>
</ul>
<hr/>
<h3 style="margin-top: 12px;">Example:</h3>
<p>Experience the ultimate skincare solution with our all-natural facial oil. Lightweight, non-greasy, and packed with botanical ingredients.</p>
<p><strong>Usage:</strong> Apply a few drops after cleansing. Suitable for all skin types.</p>
<img src="https://res.cloudinary.com/demo/image/upload/sample.jpg" alt="Spa Oil" />
<table border="1" cellpadding="6" cellspacing="0">
  <thead><tr><th>Size</th><th>Volume</th></tr></thead>
  <tbody><tr><td>Small</td><td>100ml</td></tr><tr><td>Large</td><td>250ml</td></tr></tbody>
</table>`