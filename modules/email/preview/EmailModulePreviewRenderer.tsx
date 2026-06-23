'use client';
import { EmailPageModule } from '@/types/emailModules';
import { EmailTitlePreview } from './EmailTitlePreview';
import { EmailImagePreview } from './EmailImagePreview';
import { EmailPromoPreview } from './EmailPromoPreview';
import { EmailKvPreview } from './EmailKvPreview';
import { EmailProductsPreview } from './EmailProductsPreview';
import { EmailImageProductsPreview } from './EmailImageProductsPreview';
import { EmailBankInfoPreview } from './EmailBankInfoPreview';
import { EmailArticlePreview } from './EmailArticlePreview';
import { EmailCouponPreview } from './EmailCouponPreview';

export function EmailModulePreviewRenderer({ module }: { module: EmailPageModule }) {
  switch (module.type) {
    case 'email-title':           return <EmailTitlePreview data={module.data} />;
    case 'email-image':           return <EmailImagePreview data={module.data} />;
    case 'email-promo':           return <EmailPromoPreview data={module.data} />;
    case 'email-kv':              return <EmailKvPreview data={module.data} />;
    case 'email-products':        return <EmailProductsPreview data={module.data} />;
    case 'email-image-products':  return <EmailImageProductsPreview data={module.data} />;
    case 'email-bank-info':       return <EmailBankInfoPreview data={module.data} />;
    case 'email-article':         return <EmailArticlePreview data={module.data} />;
    case 'email-coupon':          return <EmailCouponPreview data={module.data} />;
    default:                      return null;
  }
}
