'use client';
import { EmailPageModule } from '@/types/emailModules';
import { EmailTitleForm } from './EmailTitleForm';
import { EmailImageForm } from './EmailImageForm';
import { EmailPromoForm } from './EmailPromoForm';
import { EmailKvForm } from './EmailKvForm';
import { EmailProductsForm } from './EmailProductsForm';
import { EmailImageProductsForm } from './EmailImageProductsForm';
import { EmailBankInfoForm } from './EmailBankInfoForm';
import { EmailArticleForm } from './EmailArticleForm';
import { EmailCouponForm } from './EmailCouponForm';

interface Props {
  module: EmailPageModule;
  onChange: (data: EmailPageModule['data']) => void;
}

export function EmailFormRenderer({ module, onChange }: Props) {
  switch (module.type) {
    case 'email-title':
      return <EmailTitleForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-image':
      return <EmailImageForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-promo':
      return <EmailPromoForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-kv':
      return <EmailKvForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-products':
      return <EmailProductsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-image-products':
      return <EmailImageProductsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-bank-info':
      return <EmailBankInfoForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-article':
      return <EmailArticleForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-coupon':
      return <EmailCouponForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    default:
      return null;
  }
}
