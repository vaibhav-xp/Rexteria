import { EnquiryType } from "./enquiry-types";
import { ModType } from "./mod-types";
import { ReviewType } from "./review-types";

export interface DashboardTypes {
  totalCategories: number;
  activeMods: number;
  totalMods: number;
  top5ModsByRating: ModType[];
  top5ModsByViews: ModType[];
  totalGalleryImage: number;
  activeUsers: number;
  recentReviews: ReviewType[];
  otps: number;
  recentEnquiry: EnquiryType[];
}
