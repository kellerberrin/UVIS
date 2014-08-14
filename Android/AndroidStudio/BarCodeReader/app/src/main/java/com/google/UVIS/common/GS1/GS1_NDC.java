package com.google.UVIS.common.GS1;

import android.util.Log;

import com.google.UVIS.FormatException;

/**
 * Created by kellerberrin on 20/04/2014.
 * Implements a class to hold a NDC identifier.
 * Note that the GS1_NDC object throws an exception in the constructor
 * if the initialization string is not a valid NDC Identifier .
 * To prevent this the NDC validity of the string should be checked (currently only checks length)
 * with static boolean GS1_NDC.ValidNDCFormat(String) before creating the object.
 */
public class GS1_NDC {

    public static final int NDC_Size = 10;

    private String m_NDCString;

// Constructors

    public GS1_NDC(String NDCString) throws FormatException {
        if (!ValidNDCFormat(NDCString)) {
            Log.e("GS1_NDC.GS1_NDC(String)", "Invalid NDC String:" + NDCString);
            throw FormatException.getFormatInstance();
        }
        SetNDCString(NDCString);
    }

    public GS1_NDC(GS1_NDC Copy) throws FormatException {
        if (!Copy.ValidNDCFormat()) {
            Log.e("GS1_NDC.GS1_NDC(Copy)", "Invalid NDC String in copy object:" + Copy.GetNDCString());
            throw FormatException.getFormatInstance();
        }
        SetNDCString(Copy.GetNDCString());
    }

// access to the member m_NDCString;

    public final String GetNDCString() { return m_NDCString; }

    private void SetNDCString(String NDCString) { m_NDCString = NDCString; }

// If the NDC first issuer digit is '0' them we know that this is a 4 digit issuer code.

    private boolean Is4DigitIssuer()
    {
        return GetNDCString().charAt(0) == '0';
    }

// Format the NDC string for display as 4-4-2, 5-3-2 or 5-4-1

    private String GetNDCString_4_4_2()
    {
        final String Hyphen = "-";
        String NDC_4_4_2;

        NDC_4_4_2 = GetNDCString().substring(0,4);
        NDC_4_4_2 = NDC_4_4_2.concat(Hyphen);
        NDC_4_4_2 = NDC_4_4_2.concat(GetNDCString().substring(4,8));
        NDC_4_4_2 = NDC_4_4_2.concat(Hyphen);
        NDC_4_4_2 = NDC_4_4_2.concat(GetNDCString().substring(8,GetNDCString().length()));

        return NDC_4_4_2;
    }

    private String GetNDCString_5_3_2()
    {
        final String Hyphen = "-";
        String NDC_5_3_2;

        NDC_5_3_2 = GetNDCString().substring(0,5);
        NDC_5_3_2 = NDC_5_3_2.concat(Hyphen);
        NDC_5_3_2 = NDC_5_3_2.concat(GetNDCString().substring(5,8));
        NDC_5_3_2 = NDC_5_3_2.concat(Hyphen);
        NDC_5_3_2 = NDC_5_3_2.concat(GetNDCString().substring(8,GetNDCString().length()));

        return NDC_5_3_2;
    }

    private String GetNDCString_5_4_1()
    {
        final String Hyphen = "-";
        String NDC_5_4_1;

        NDC_5_4_1 = GetNDCString().substring(0,5);
        NDC_5_4_1 = NDC_5_4_1.concat(Hyphen);
        NDC_5_4_1 = NDC_5_4_1.concat(GetNDCString().substring(5,9));
        NDC_5_4_1 = NDC_5_4_1.concat(Hyphen);
        NDC_5_4_1 = NDC_5_4_1.concat(GetNDCString().substring(9,GetNDCString().length()));

        return NDC_5_4_1;
    }

    public String FormattedNDC()
    {

        return Is4DigitIssuer() ? GetNDCString_4_4_2() : GetNDCString_5_3_2();

    }


// Checks if a string is valid NDC code. Currently only checks string length.
// todo: Add more sophisticated database checks.

    static public boolean ValidNDCFormat(String NDCString)
    {
        return NDCString.length() == NDC_Size;
    }

// Instance validation.

    protected final boolean ValidNDCFormat() { return ValidNDCFormat(GetNDCString()); }

}
