import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { SA_PROVINCES } from '../../utils/checkoutUtils';

export interface ShippingAddressData {
  fullName?: string;
  phone?: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface ShippingAddressErrors {
  fullName?: string;
  phone?: string;
  streetNumber?: string;
  streetName?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

interface ShippingAddressSectionProps {
  formData: ShippingAddressData;
  errors: ShippingAddressErrors;
  touched: Record<string, boolean>;
  onChange: (field: keyof ShippingAddressData, value: string) => void;
  onBlur: (field: keyof ShippingAddressData) => void;
}

export const ShippingAddressSection: React.FC<ShippingAddressSectionProps> = ({
  formData,
  errors,
  touched,
  onChange,
  onBlur,
}) => {
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('fullName', e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('phone', e.target.value);
  };

  const handleStreetNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and optional letter suffix (e.g. 42 or 42A), no random symbols
    const val = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 8);
    onChange('streetNumber', val);
  };

  const handleStreetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow letters, spaces, and common punctuation — NO digits
    const val = e.target.value.replace(/[^a-zA-Z\s'.-]/g, '');
    onChange('streetName', val);
  };

  const handleStreetNamePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Strip digits from pasted text before applying it
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const sanitised = pasted.replace(/[^a-zA-Z\s'.-]/g, '');
    const current = formData.streetName;
    const input = e.currentTarget;
    const start = input.selectionStart ?? current.length;
    const end = input.selectionEnd ?? current.length;
    const newVal = current.slice(0, start) + sanitised + current.slice(end);
    onChange('streetName', newVal);
  };

  const handleSuburbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Letters, spaces, hyphens, apostrophes
    const val = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
    onChange('suburb', val);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Do not allow numbers in City
    const val = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
    onChange('city', val);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // SA Postal code: numbers only, max 4 digits
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange('postalCode', val);
  };

  return (
    <section className="checkout-card shipping-card" aria-labelledby="shipping-heading">
      <div className="card-header">
        <h2 id="shipping-heading" className="card-title">
          SHIPPING ADDRESS
        </h2>
      </div>

      <div className="checkout-form-grid">
        {/* Row 0: Full Name & Phone Number */}
        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="fullName"
                name="fullName"
                autoComplete="name"
                placeholder="e.g. Marcus Redelinghuys"
                value={formData.fullName || ''}
                onChange={handleFullNameChange}
                onBlur={() => onBlur('fullName')}
                className={`form-input ${touched.fullName && errors.fullName ? 'input-error' : ''} ${
                  touched.fullName && !errors.fullName && formData.fullName ? 'input-valid' : ''
                }`}
                aria-invalid={Boolean(touched.fullName && errors.fullName)}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                required
              />
              {touched.fullName && !errors.fullName && formData.fullName && (
                <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
              )}
            </div>
            {touched.fullName && errors.fullName && (
              <p id="fullName-error" className="field-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                placeholder="e.g. +27 82 555 1234"
                value={formData.phone || ''}
                onChange={handlePhoneChange}
                onBlur={() => onBlur('phone')}
                className={`form-input ${touched.phone && errors.phone ? 'input-error' : ''} ${
                  touched.phone && !errors.phone && formData.phone ? 'input-valid' : ''
                }`}
                aria-invalid={Boolean(touched.phone && errors.phone)}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                required
              />
              {touched.phone && !errors.phone && formData.phone && (
                <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
              )}
            </div>
            {touched.phone && errors.phone && (
              <p id="phone-error" className="field-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 1: Street Number & Street Name */}
        <div className="form-row two-cols-unequal">
          <div className="form-group col-street-number">
            <label htmlFor="streetNumber" className="form-label">
              Street Number <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="streetNumber"
                name="streetNumber"
                placeholder="42 or 42A"
                value={formData.streetNumber}
                onChange={handleStreetNumberChange}
                onBlur={() => onBlur('streetNumber')}
                className={`form-input ${touched.streetNumber && errors.streetNumber ? 'input-error' : ''} ${
                  touched.streetNumber && !errors.streetNumber && formData.streetNumber ? 'input-valid' : ''
                }`}
                aria-invalid={Boolean(touched.streetNumber && errors.streetNumber)}
                aria-describedby={errors.streetNumber ? 'streetNumber-error' : undefined}
                required
              />
              {touched.streetNumber && !errors.streetNumber && formData.streetNumber && (
                <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
              )}
            </div>
            {touched.streetNumber && errors.streetNumber && (
              <p id="streetNumber-error" className="field-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.streetNumber}</span>
              </p>
            )}
          </div>

          <div className="form-group col-street-name">
            <label htmlFor="streetName" className="form-label">
              Street Name <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="streetName"
                name="streetName"
                autoComplete="address-line1"
                placeholder="Sneakerhead Ave"
                value={formData.streetName}
                onChange={handleStreetNameChange}
                onPaste={handleStreetNamePaste}
                onBlur={() => onBlur('streetName')}
                className={`form-input ${touched.streetName && errors.streetName ? 'input-error' : ''} ${
                  touched.streetName && !errors.streetName && formData.streetName ? 'input-valid' : ''
                }`}
                aria-invalid={Boolean(touched.streetName && errors.streetName)}
                aria-describedby={errors.streetName ? 'streetName-error' : undefined}
                required
              />
              {touched.streetName && !errors.streetName && formData.streetName && (
                <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
              )}
            </div>
            {touched.streetName && errors.streetName && (
              <p id="streetName-error" className="field-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.streetName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Suburb & City */}
        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="suburb" className="form-label">
              Suburb <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="suburb"
                name="suburb"
                placeholder="Rosebank"
                value={formData.suburb}
                onChange={handleSuburbChange}
                onBlur={() => onBlur('suburb')}
                className={`form-input ${touched.suburb && errors.suburb ? 'input-error' : ''} ${
                  touched.suburb && !errors.suburb && formData.suburb ? 'input-valid' : ''
                }`}
                aria-invalid={Boolean(touched.suburb && errors.suburb)}
                aria-describedby={errors.suburb ? 'suburb-error' : undefined}
                required
              />
              {touched.suburb && !errors.suburb && formData.suburb && (
                <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
              )}
            </div>
            {touched.suburb && errors.suburb && (
              <p id="suburb-error" className="field-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.suburb}</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="city" className="form-label">
              City <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="city"
                name="city"
                autoComplete="address-level2"
                placeholder="Johannesburg"
                value={formData.city}
                onChange={handleCityChange}
                onBlur={() => onBlur('city')}
                className={`form-input ${touched.city && errors.city ? 'input-error' : ''} ${
                  touched.city && !errors.city && formData.city ? 'input-valid' : ''
                }`}
                aria-invalid={Boolean(touched.city && errors.city)}
                aria-describedby={errors.city ? 'city-error' : undefined}
                required
              />
              {touched.city && !errors.city && formData.city && (
                <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
              )}
            </div>
            {touched.city && errors.city && (
              <p id="city-error" className="field-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.city}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Province & Postal Code */}
        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="province" className="form-label">
              Province <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <select
                id="province"
                name="province"
                autoComplete="address-level1"
                value={formData.province}
                onChange={(e) => onChange('province', e.target.value)}
                onBlur={() => onBlur('province')}
                className={`form-select ${touched.province && errors.province ? 'input-error' : ''} ${
                  touched.province && !errors.province && formData.province ? 'input-valid' : ''
                }`}
                aria-invalid={Boolean(touched.province && errors.province)}
                aria-describedby={errors.province ? 'province-error' : undefined}
                required
              >
                <option value="">Select Province</option>
                {SA_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
            {touched.province && errors.province && (
              <p id="province-error" className="field-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.province}</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="postalCode" className="form-label">
              Postal Code <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                autoComplete="postal-code"
                placeholder="2196"
                maxLength={4}
                value={formData.postalCode}
                onChange={handlePostalCodeChange}
                onBlur={() => onBlur('postalCode')}
                className={`form-input ${touched.postalCode && errors.postalCode ? 'input-error' : ''} ${
                  touched.postalCode && !errors.postalCode && formData.postalCode ? 'input-valid' : ''
                }`}
                aria-invalid={Boolean(touched.postalCode && errors.postalCode)}
                aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                required
              />
              {touched.postalCode && !errors.postalCode && formData.postalCode && (
                <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
              )}
            </div>
            {touched.postalCode && errors.postalCode && (
              <p id="postalCode-error" className="field-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.postalCode}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
