import { CartModType, CartTypes } from "@/types/cart-types";
import { NextRequestWithUser } from "@/types/response-types";

export const whatsappNumber = 7309526841;

export const generateWhatsAppMessage = (
  user: {
    name: string;
    email: string;
    phone: string;
    country: string;
    instagram?: string;
    youtube?: string;
    x?: string;
  },
  cartItems: CartTypes,
  req: NextRequestWithUser,
  userMessage?: string
) => {
  let message = `Hello, my name is *${user.name}*.
\n`;
  const cart = cartItems.mods as CartModType[];

  message += `*Email:* ${user.email}\n`;
  message += `*Country:* ${user.country}\n`;
  message += `*Phone:* +91 ${user.phone}\n`;

  if (user.instagram) message += `*Instagram:* ${user.instagram}\n`;
  if (user.youtube) message += `*YouTube:* ${user.youtube}\n`;
  if (user.x) message += `*X (Twitter):* ${user.x}\n`;

  message += `\n*I want to purchase the following mods:*\n\n`;

  cart.forEach((item, index) => {
    if (typeof item.mod_id === "string") return;
    const mod = item.mod_id;

    message += `${index + 1}. *Title:* ${mod.title}\n`;
    message += `   - *Category:* ${mod.categoryId?.title || "N/A"}\n`;
    message += `   - *Quantity:* ${item.quantity}\n`;
    message += `   - *Price:* ₹${mod.price}\n`;
    message += `   - *Discount:* ${mod.discount}%\n`;
    message += `   - *Final Price:* ₹${mod.discount_price}\n`;

    if (mod.main_image?.url) {
      message += `   - *Link:* ${new URL(`/mods/${mod.slug}`, req.url).href}\n`;
    }

    message += "---------------------------\n";
  });

  const totalItems = cart.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  message += `*Total Items:* ${totalItems}\n`;
  message += `*Estimated Total:* ₹${totalPrice}\n\n`;

  if (userMessage) {
    message += `*Message:*\n"${userMessage}"\n\n`;
  }
  return encodeURIComponent(message);
};
