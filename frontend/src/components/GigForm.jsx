import {
  useState
} from "react";

function GigForm({
  initialValues,
  onSubmit,
  submitting,
  submitLabel
}) {
  const [
  formData,
  setFormData
] = useState(() => ({
  title:
    initialValues?.title ||
    "",

  description:
    initialValues?.description ||
    "",

  category:
    initialValues?.category ||
    "",

  price:
    initialValues?.price ??
    "",

  deliveryDays:
    initialValues?.deliveryDays ??
    "",

  isActive:
    initialValues?.isActive ??
    true
}));

  const [
    error,
    setError
  ] = useState("");

  const handleChange =
    (event) => {
      const {
        name,
        value,
        type,
        checked
      } = event.target;

      setFormData(
        (current) => ({
          ...current,

          [name]:
            type === "checkbox"
              ? checked
              : value
        })
      );
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      const price =
        Number(
          formData.price
        );

      const deliveryDays =
        Number(
          formData.deliveryDays
        );

      if (
        !Number.isFinite(price) ||
        price <= 0
      ) {
        setError(
          "Price must be greater than zero."
        );

        return;
      }

      if (
        !Number.isInteger(
          deliveryDays
        ) ||
        deliveryDays < 1
      ) {
        setError(
          "Delivery days must be a positive whole number."
        );

        return;
      }

      await onSubmit({
        title:
          formData.title,

        description:
          formData.description,

        category:
          formData.category,

        price,

        deliveryDays,

        isActive:
          formData.isActive
      });
    };

  return (
    <form
      className="gig-form"
      onSubmit={
        handleSubmit
      }
    >

      {error && (
        <div
          className="alert alert-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="form-group">

        <label
          htmlFor="title"
        >
          Gig title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={
            formData.title
          }
          onChange={
            handleChange
          }
          minLength={3}
          maxLength={100}
          required
          placeholder="e.g. Professional Logo Design"
        />

      </div>

      <div className="form-group">

        <label
          htmlFor="category"
        >
          Category
        </label>

        <input
          id="category"
          name="category"
          type="text"
          value={
            formData.category
          }
          onChange={
            handleChange
          }
          minLength={2}
          maxLength={60}
          required
          placeholder="e.g. Graphic Design"
        />

      </div>

      <div className="form-group">

        <label
          htmlFor="description"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={
            formData.description
          }
          onChange={
            handleChange
          }
          minLength={10}
          maxLength={2000}
          rows={7}
          required
          placeholder="Describe the service you provide..."
        />

        <small>
          Maximum 2,000 characters.
        </small>

      </div>

      <div className="gig-form-row">

        <div className="form-group">

          <label
            htmlFor="price"
          >
            Price (ZAR)
          </label>

          <input
            id="price"
            name="price"
            type="number"
            value={
              formData.price
            }
            onChange={
              handleChange
            }
            min="0.01"
            max="1000000"
            step="0.01"
            required
            placeholder="850"
          />

        </div>

        <div className="form-group">

          <label
            htmlFor="deliveryDays"
          >
            Delivery time
          </label>

          <input
            id="deliveryDays"
            name="deliveryDays"
            type="number"
            value={
              formData.deliveryDays
            }
            onChange={
              handleChange
            }
            min="1"
            max="365"
            step="1"
            required
            placeholder="5"
          />

        </div>

      </div>

      <label className="toggle-field">

        <input
          name="isActive"
          type="checkbox"
          checked={
            formData.isActive
          }
          onChange={
            handleChange
          }
        />

        <span>
          <strong>
            Active marketplace listing
          </strong>

          <small>
            Active Gigs are visible
            in the public Marketplace.
          </small>
        </span>

      </label>

      <button
        type="submit"
        className="button button-primary gig-form-submit"
        disabled={
          submitting
        }
      >
        {submitting
          ? "Saving..."
          : submitLabel}
      </button>

    </form>
  );
}

export default GigForm;