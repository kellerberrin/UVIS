.. _usdrugdatabasedoc:


.. |action| image:: emphasize.png
    :width: 20pt
    :height: 20pt
    
US Drug Database Documentation
==============================    

|
|
|
|    

.. image:: GAEsmall.jpg
    :width: 62px
    :align: left
    :height: 55px
    :target: https://developers.google.com/appengine/downloads/
    
Google App Engine Implementation
--------------------------------  

The National Drug Code Database Background Information available here:
`<http://www.fda.gov/drugs/developmentapprovalprocess/ucm070829>`_

This contains a database of drugs and NDC Codes as .csv files. 


The Product Table (FDA)
+++++++++++++++++++++++

The fields of the Product Table are available in a CSV file and are:

1.	ProductID   Text/string. "0002-1200_4322f73b-3cb5-4e67-a909-0725bbe666c3"

    ProductID is a concatenation of the NDCproduct code and SPL documentID. It is included to help prevent duplicate rows 
    from appearing when joining the product and package files together. It has no regulatory value or significance.
 
2.	**ProductNDC www.fda.gov/edrls1 under Structured Product Labeling Resources.   Text/string. (primary key) "0002-1200"**

    The labeler code and product code segments of the National Drug Code number, separated by a hyphen. 
    Asterisks are no longer used or included within the product code segment to indicate certain configurations of the NDC.
 
3.	**ProductTypeName  Text/string. "HUMAN PRESCRIPTION DRUG"**

    Indicates the type of product, such as Human Prescription Drug or Human OTC Drug. This data element corresponds to the 
    “Document Type” of the SPL submission for the listing. The complete list of codes and translations can be found at
 
4.	**ProprietaryName Text/string. "Amyvid"**

    Also known as the trade name. It is the name of the product chosen by the labeler.
 
5.	ProprietaryNameSuffix NULL Text/string.

    A suffix to the proprietary name, a value here should be appended to the ProprietaryName field to obtain the complete name 
    of the product. This suffix is often used to distinguish characteristics of a product such as extended release (“XR”) or 
    sleep aid (“PM”). Although many companies follow certain naming conventions for suffices, there is no recognized standard.
 
6.	**NonProprietaryName Text/string. MV  "Florbetapir F 18"**
  
    Sometimes called the generic name, this is usually the active ingredient(s) of the product.
 
7.	**DosageFormName Text/string. "INJECTION, SOLUTION"**

    The translation of the DosageForm Code submitted by the firm. The complete list of codes and translations can be found 
    www.fda.gov/edrls2 under Structured Product Labeling Resources.
 
8.	**RouteName  Text/string.  "INTRAVENOUS"**
   
    The translation of the Route Code submitted by the firm, indicating route of administration. 
    The complete list of codes and translations can be found at www.fda.gov/edrls3 under Structured Product Labeling Resources.
 
9.	StartMarketingDate Text/string. [Include format] "20120601"

    This is the date that the labeler indicates was the start of its marketing of the drug product.
 
10.	EndMarketingDate  NULL Text/string. [Include format] 

    This is the date the product will no longer be available on the market. If a product is no longer being manufactured, 
    in most cases, the FDA recommends firms use the expiration date of the last lot produced as the EndMarketingDate, to reflect 
    the potential for drug product to remain available after manufacturing has ceased. Products that are the subject of 
    ongoing manufacturing will not ordinarily have any EndMarketingDate. Products with a value in the EndMarketingDate will be 
    removed from the NDC Directory when the EndMarketingDate is reached.
 
11.	MarketingCategoryName Text/string. "NDA"

    Product types are broken down into several potential Marketing Categories, such as NDA/ANDA/BLA, OTC Monograph, or Unapproved Drug. One and only one Marketing Category may be chosen for a product, not all marketing categories are available to all product types. Currently, only final marketed product categories are included.  The complete list of codes and translations can be found at www.fda.gov/edrls4 under Structured Product Labeling Resources.
 
12.	**ApplicationNumber    NULL Text/string.   "NDA202008"**

    This corresponds to the NDA, ANDA, or BLA number reported by the labeler for products which have the 
    corresponding Marketing Category designated. If the designated Marketing Category is OTC Monograph Final or OTC Monograph 
    Not Final, then the Application number will be the CFR citation corresponding to the appropriate Monograph (e.g. “part 341”). 
    For unapproved drugs, this field will be null.
 
13.	**LabelerName Text/string. "Eli Lilly and Company"**

    Name of Company corresponding to the labeler code segment of the ProductNDC.
 
14.	**SubstanceName   Text/string. MV  "FLUOXETINE HYDROCHLORIDE; OLANZAPINE" If more than one substance, then each substance is separated by a semicolon.**

    This is the active ingredient list. Each ingredient name is the preferred term of the UNII code submitted. 
 
15.	**StrengthNumber Text/string. MV "25; 3" If more than one substance, then each strength is separated by a semicolon.**

    These are the strength values (to be used with units below) of each active ingredient, listed in the same order as the 
    SubstanceName field above.
 
16.	**StrengthUnit  Text/string. MV "mg/1; mg/1" If more than one substance, then each strength unit  is separated by a semicolon.**

    These are the units to be used with the strength values above, listed in the same order as the SubstanceName and SubstanceNumber.
 
17.	**Pharm_Classes Text/string. MV "Atypical Antipsychotic [EPC],Serotonin Reuptake Inhibitor [EPC],Serotonin Uptake Inhibitors [MoA]"**

    These are the reported pharmacological class categories corresponding to the SubstanceNames listed above.
 
18.	DEASchedule Text/string.  

    This is the assigned DEA Schedule number as reported by the labeler. Values are CI, CII, CIII, CIV, and CV.


**The fields used in the US Drug Database are as follows: 2,3,4,6,7,8,12,13,14,15,16,17.**


The Package File (FDA)
++++++++++++++++++++++ 


These two fields are concatenated onto the front of the package field.

1.	ProductID  Text/string. "0002-1200_4322f73b-3cb5-4e67-a909-0725bbe666c3" 

    ProductID is a concatenation of the NDCproduct code and SPL documentID. It is included to help prevent duplicate 
    rows from appearing when joining the product and package files together.  It has no regulatory value or significance.

2.	ProductNDC  Text/string.  "0002-1200"

    The labeler code and product code segments of the National Drug Code number, separated by a hyphen. Asterisks 
    are no longer used or included within the product code segment to indicate certain configurations of the NDC.
 
3.	**NDCPackageCode Text/string   "0002-1200-10"**

    The labeler code, product code, and package code segments of the National Drug Code number, separated by hyphens. 
    Asterisks are no longer used or included within the product and package code segments to indicate certain configurations of the NDC.
 
4.	**PackageDescription   Text/string  "1 VIAL, MULTI-DOSE in 1 CAN (0002-1200-10)  > 10 mL in 1 VIAL, MULTI-DOSE"**

    A description of the size and type of packaging in sentence form. Multilevel packages will have the descriptions 
    concatenated together.  For example: 4 BOTTLES in 1 CARTON/100 TABLETS in 1 BOTTLE.
    

The composite CSV file Layout.
+++++++++++++++++++++++++++++++++++++++++

A CSV data file is created from the a composite of the FDA product and package files
above. In particular, the product file is 'joined' with the package file using the 
partial NDC code in the product file. This join is then projected onto the fields listed below.
Two additional fields are also generated (first two fields).  

Field List.

Need to add 2 additional fields 

1.	NDC "text" the 10 digit NDC string (primary key)

    This is created from the NDCPackageCode field of the package file by removing the hyphens. 

2.	Format the labeller string, product, package format e.g. "4-4-2".

    The Format code is determined from the hyphen spacing in the  NDCPackageCode field of the package file.


4.  Field 3. Product File; ProductTypeName  Text/string. "HUMAN PRESCRIPTION DRUG"

5.  Field 4. Product File; ProprietaryName Text/string. "Amyvid"

6.  Field 6. Product File; NonProprietaryName Text/string. MV  "Florbetapir F 18"

7.  Field 7. Product File; DosageFormName Text/string. "INJECTION, SOLUTION"

8.  Field 8. Product File; RouteName  Text/string.  "INTRAVENOUS"

9.  Field 12. Product File; ApplicationNumber    NULL Text/string.   "NDA202008"

10. Field 13. Product File; LabelerName Text/string. "Eli Lilly and Company"

11. Field 14. Product File; SubstanceName Text/string. MV  "FLUOXETINE HYDROCHLORIDE; OLANZAPINE" If more than one substance, then each substance is separated by a semicolon.	

12. Field 15. Product File; StrengthNumber Text/string. MV "25; 3" If more than one substance, then each strength is separated by a semicolon.

13. Field 16. Product File; StrengthUnit  Text/string. MV "mg/1; mg/1" If more than one substance, then each strength unit  is separated by a semicolon.	

14. Field 17. Product File; Pharm_Classes Text string. If more than one substance, then each strength is separated by a comma. Example, MV "Atypical Antipsychotic [EPC],Serotonin Reuptake Inhibitor [EPC],Serotonin Uptake Inhibitors [MoA]"

15. Field 4. Package File; PackageDescription   Text/string  "1 VIAL, MULTI-DOSE in 1 CAN (0002-1200-10)  > 10 mL in 1 VIAL, MULTI-DOSE"
  

The Kind = **"NDCLookup"** Entity Layout.
+++++++++++++++++++++++++++++++++++++++++

The GAE datastore is a "High Replication" database. It is not a standard SQL database but is based on the "Big Table" concept.
Database tables are referred to as a "Kind". The entry in the "Kind" is an "Entity" and can be best thought of
as a stored object (or in SQL terms a table row).

Kind = **"NDCLookup"**  

The entity layout. This is constructed from the product and package csv files from the 
FDA database.
  
