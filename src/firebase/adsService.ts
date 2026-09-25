import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from './config';
import { handleFirestoreError, OperationType } from './error';
import { Ad, MoroccanCity } from '../types';
import { INITIAL_ADS, SAMPLE_FIRESTORE_ADS } from '../data/mockData';
import { getSanitizedImages } from '../utils/imageUtils';

const ADS_COLLECTION = 'ads';

// Ensure 3 sample listings with real Unsplash image URLs exist in Firestore
export async function seedSampleListingsInFirestore(): Promise<void> {
  try {
    for (const sample of SAMPLE_FIRESTORE_ADS) {
      const docRef = doc(db, ADS_COLLECTION, sample.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          title: sample.title,
          description: sample.description,
          price: sample.price,
          isNegotiable: sample.isNegotiable,
          categoryId: sample.categoryId,
          subCategory: sample.subCategory || '',
          city: sample.city,
          neighborhood: sample.neighborhood,
          date: sample.date,
          images: sample.images,
          imageUrl: sample.imageUrl || sample.images[0],
          sellerId: sample.seller.id,
          sellerName: sample.seller.name,
          sellerPhone: sample.seller.phone,
          sellerWhatsApp: sample.seller.whatsapp,
          condition: sample.condition,
          isFeatured: sample.isFeatured || false,
          viewsCount: sample.viewsCount,
          status: sample.status || 'active',
          specs: sample.specs || {},
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn('Notice seeding sample listings in Firestore:', err);
  }
}

// Listen to all ads in real-time from Firestore
export function subscribeToAds(callback: (ads: Ad[]) => void): () => void {
  // Proactively ensure sample listings exist in Firestore
  seedSampleListingsInFirestore().catch(() => {});

  const adsRef = collection(db, ADS_COLLECTION);
  const q = query(adsRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const adsList: Ad[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const rawImages = Array.isArray(data.images) ? data.images : [];
        if (data.imageUrl && !rawImages.includes(data.imageUrl)) {
          rawImages.unshift(data.imageUrl);
        }
        const cleanImages = getSanitizedImages({
          images: rawImages,
          imageUrl: data.imageUrl,
          categoryId: data.categoryId,
        });

        adsList.push({
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          price: Number(data.price) || 0,
          isNegotiable: Boolean(data.isNegotiable),
          categoryId: data.categoryId || 'real-estate',
          subCategory: data.subCategory || '',
          city: (data.city as MoroccanCity) || 'الدار البيضاء',
          neighborhood: data.neighborhood || '',
          date: data.date || 'اليوم',
          images: cleanImages,
          imageUrl: cleanImages[0],
          seller: {
            id: data.sellerId || 'seller-system',
            name: data.sellerName || 'بائع في سوق المغرب',
            phone: data.sellerPhone || '0661223344',
            whatsapp: data.sellerWhatsApp || '212661223344',
            city: data.city || 'الدار البيضاء',
            isVerified: true,
            memberSince: '2023',
            rating: 4.9,
            reviewsCount: 14,
            totalListings: 1,
          },
          condition: data.condition || 'غير محدد',
          isFeatured: Boolean(data.isFeatured),
          viewsCount: Number(data.viewsCount) || 1,
          status: data.status || 'active',
          specs: data.specs || {},
        });
      });

      // If Firestore is empty, seed demo ads
      if (adsList.length === 0) {
        seedInitialAdsIfEmpty().then((seeded) => {
          if (seeded.length > 0) callback(seeded);
        });
      } else {
        callback(adsList);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, ADS_COLLECTION);
    }
  );
}

// Seed initial ads into Firestore if empty
export async function seedInitialAdsIfEmpty(): Promise<Ad[]> {
  const adsRef = collection(db, ADS_COLLECTION);
  try {
    const existing = await getDocs(adsRef);
    if (!existing.empty) {
      return [];
    }

    const batch = writeBatch(db);
    INITIAL_ADS.forEach((ad) => {
      const docRef = doc(db, ADS_COLLECTION, ad.id);
      batch.set(docRef, {
        title: ad.title,
        description: ad.description,
        price: ad.price,
        isNegotiable: ad.isNegotiable,
        categoryId: ad.categoryId,
        subCategory: ad.subCategory || '',
        city: ad.city,
        neighborhood: ad.neighborhood,
        date: ad.date,
        images: ad.images,
        imageUrl: ad.imageUrl || ad.images[0],
        sellerId: auth.currentUser?.uid || 'seed-system',
        sellerName: ad.seller.name,
        sellerPhone: ad.seller.phone,
        sellerWhatsApp: ad.seller.whatsapp,
        condition: ad.condition,
        isFeatured: ad.isFeatured || false,
        viewsCount: ad.viewsCount,
        status: ad.status || 'active',
        specs: ad.specs || {},
        createdAt: new Date().toISOString(),
      });
    });

    await batch.commit();
    return INITIAL_ADS;
  } catch (error) {
    console.warn('Seeding initial ads notice:', error);
    return INITIAL_ADS;
  }
}

// Upload ad image to Firebase Storage (with base64 fallback)
export async function uploadAdImage(file: File | string, adId: string, index: number): Promise<string> {
  if (typeof file === 'string') {
    return file; // If already a URL or base64
  }

  try {
    const storageRef = ref(storage, `ads/${adId}/image_${index}_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.warn('Firebase Storage upload failed, converting to data URL:', error);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Create Ad in Firestore
export async function createAdInFirestore(adData: Omit<Ad, 'id'>): Promise<string> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error('يجب تسجيل الدخول أولاً لإضافة إعلان في سوق المغرب');
  }

  const newDocRef = doc(collection(db, ADS_COLLECTION));
  const adId = newDocRef.id;

  try {
    await setDoc(newDocRef, {
      title: adData.title,
      description: adData.description,
      price: adData.price,
      isNegotiable: adData.isNegotiable,
      categoryId: adData.categoryId,
      subCategory: adData.subCategory || '',
      city: adData.city,
      neighborhood: adData.neighborhood,
      date: 'الآن',
      images: adData.images,
      sellerId: currentUid,
      sellerName: adData.seller.name,
      sellerPhone: adData.seller.phone,
      sellerWhatsApp: adData.seller.whatsapp,
      condition: adData.condition,
      isFeatured: false,
      viewsCount: 1,
      status: 'active',
      specs: adData.specs || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return adId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ADS_COLLECTION}/${adId}`);
  }
}

// Update Ad in Firestore
export async function updateAdInFirestore(adId: string, data: Partial<Ad>): Promise<void> {
  const adRef = doc(db, ADS_COLLECTION, adId);
  try {
    await updateDoc(adRef, {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.isNegotiable !== undefined && { isNegotiable: data.isNegotiable }),
      ...(data.status && { status: data.status }),
      ...(data.city && { city: data.city }),
      ...(data.neighborhood && { neighborhood: data.neighborhood }),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ADS_COLLECTION}/${adId}`);
  }
}

// Delete Ad in Firestore
export async function deleteAdInFirestore(adId: string): Promise<void> {
  const adRef = doc(db, ADS_COLLECTION, adId);
  try {
    await deleteDoc(adRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ADS_COLLECTION}/${adId}`);
  }
}

// User Favorites in Firestore
export function subscribeToUserFavorites(userId: string, callback: (adIds: string[]) => void): () => void {
  const favsRef = collection(db, 'users', userId, 'favorites');
  return onSnapshot(
    favsRef,
    (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach((d) => ids.push(d.id));
      callback(ids);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/favorites`);
    }
  );
}

export async function toggleFavoriteInFirestore(userId: string, adId: string, isFav: boolean): Promise<void> {
  const favDocRef = doc(db, 'users', userId, 'favorites', adId);
  try {
    if (isFav) {
      await deleteDoc(favDocRef);
    } else {
      await setDoc(favDocRef, {
        adId,
        userId,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, isFav ? OperationType.DELETE : OperationType.CREATE, `users/${userId}/favorites/${adId}`);
  }
}

// Send buyer-to-seller inquiry message in Firestore
export async function sendInquiryMessage(adId: string, adTitle: string, recipientId: string, messageText: string): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error('يجب تسجيل الدخول لإرسال رسالة للبائع');
  }

  const msgRef = doc(collection(db, 'messages'));
  try {
    await setDoc(msgRef, {
      adId,
      adTitle,
      senderId: currentUid,
      senderName: auth.currentUser?.displayName || 'مشتري مهتم',
      recipientId,
      message: messageText,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `messages/${msgRef.id}`);
  }
}
