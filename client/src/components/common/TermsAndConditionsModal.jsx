// TermsAndConditionsModal.jsx
import React from "react";
import Modal from "react-modal";
import Terms from "../../assets/jsons/Terms.json";

Modal.setAppElement("#root");

const TermsAndConditionsModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-6 rounded-md shadow-md max-w-screen-md w-full mx-auto my-16 relative overflow-y-auto max-h-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-white rounded-md bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">
        Terms and Conditions
      </h2>
      <div className="space-y-4">
        <section>
          <h3 className="text-xl font-semibold">Introduction</h3>
          <p>{Terms.termsAndConditions.introduction}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Acceptance of Terms</h3>
          <p>{Terms.termsAndConditions.acceptanceOfTerms}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Purpose of the System</h3>
          <p>{Terms.termsAndConditions.purposeOfTheSystem}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">User Responsibilities</h3>
          <ul className="list-disc pl-6">
            {Terms.termsAndConditions.userResponsibilities.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Prohibited Activities</h3>
          <ul className="list-disc pl-6">
            {Terms.termsAndConditions.prohibitedActivities.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Data Privacy and Security</h3>
          <p>{Terms.termsAndConditions.dataPrivacyAndSecurity}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Limitation of Liability</h3>
          <p>{Terms.termsAndConditions.limitationOfLiability}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Modification of Terms</h3>
          <p>{Terms.termsAndConditions.modificationOfTerms}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Termination of Access</h3>
          <p>{Terms.termsAndConditions.terminationOfAccess}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Governing Law</h3>
          <p>{Terms.termsAndConditions.governingLaw}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Contact Information</h3>
          <p>{Terms.termsAndConditions.contactInformation}</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Acknowledgment</h3>
          <p>{Terms.termsAndConditions.acknowledgment}</p>
        </section>
      </div>
    </Modal>
  );
};

export default TermsAndConditionsModal;
